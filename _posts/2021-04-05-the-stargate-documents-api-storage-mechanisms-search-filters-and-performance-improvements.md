---
layout: post
title: "The Stargate Documents API: Storage mechanisms, search filters, and performance improvements"
date:   2021-04-05 00:00:00 -0000
synopsis: "The Stargate Documents API has made great strides in the past few months. After being introduced as open-source software in late 2020, its development has accelerated quickly. I’m here to give you the rundown: the premises on which we built it, the limitations we’ve faced and worked through, and most importantly, the improvements we have made as a community in the past few months. Let’s get started!"
author_info:
  name:
    first: "Eric"
    last: "Borczuk"
  picture: "assets/images/stargate-profile.png"
---

The Stargate Documents API has made great strides in the past few months. After being introduced as open-source software in late 2020, its development has accelerated quickly. I’m here to give you the rundown: the premises on which we built it, the limitations we’ve faced and worked through, and most importantly, the improvements we have made as a community in the past few months. Let’s get started!

## What is the Documents API?
The Documents API is a part of [Stargate](https://stargate.io/) that enables a user to create, get, modify, delete, and search JSON documents in a collection, all backed by the power and robustness of Apache Cassandra. For the uninitiated, this might seem a little bit like fantasy. An API that facilitates working with JSON documents against a storage database that enforces a schema seems like a bridge between two different worlds, but that is exactly what Stargate is! At its core, the Documents API abstracts away the complexities of converting JSON documents into tabular form and back again, so from a user’s perspective, they only work with JSON over HTTP at any given point.

One of the use-cases that the Documents API is perfect for is rapid iteration. Creating an application quickly, making a bunch of changes, and still being able to store documents in whatever form you desire without any lock-in to a schema is a very potent pattern that is used by agile organizations. Not having to define a schema before storing data is incredibly powerful for this purpose. And because it’s built on Cassandra, there will be pathways in the future to migrate to having a defined schema, when your application has settled on a format for its various data.

There are three main benefits to creating a free-form document API against Cassandra in particular:
- **Convenience**: Perhaps you want to start collecting and storing (and searching!) data without knowing precisely what schema it might conform to. Maybe you have such free-form data that you don’t want to require a schema so early in development.
- **Scalability**: Other document stores scale up pretty far, but Cassandra is well-known as the database of greatest scale, being able to theoretically scale infinitely with infinite resources.
- **Durability**: While other document stores do have this to some degree, Cassandra has a distributed node infrastructure that ensures that data is never lost, and also that downtime is virtually never experienced.

In order to create the Documents API with these three main benefits in mind, we first had to devise a reasonable method of storage of JSON documents. Because the end user does not interact with the Cassandra schema directly, it is up to the API to decide upon and maintain the schema as-is. We decided to do what we describe as “shredding” the JSON document, in order to get it into a form that can easily be stored in Cassandra. This process of shredding can be shown by example; a JSON blob such as:

{% highlight javascript %}
{
“a”: “key”
“b”: { “nested”: “key1” }
“c”: [0, 1, 2]  
}
{% endhighlight %}

can be turned into a form where there is one row per *value* in the JSON:

{% highlight javascript %}
a=”key”
b.nested=”key1”
c.[0]=0
c.[1]=1
c.[2]=2
{% endhighlight %}

This is the shredding process, and the data gets stored in a table with a name of the user’s choosing (from their perspective it is called a **collection**) with a schema as follows:

| key text | p0 text | p1 text | p2 text | p3 text | ... | pmax text | dbl_value double | text_value text | bool_value boolean |
|----------|---------|---------|---------|---------|-----|-----------|------------------|-----------------|--------------------|
| docname  | a       |         |         |         |     |           |                  | key             |                    |
| docname  | b       | nested  |         |         |     |           |                  | key1            |                    |
| docname  | c       | [0]     |         |         |     |           | 0                |                 |                    |
| docname  | c       | [1]     |         |         |     |           | 1                |                 |                    |
| docname  | c       | [2]     |         |         |     |           | 2                |                 |                    |

Because Cassandra’s storage format stores rows in a “sparse” format--that is, it only stores the value of non-null columns--this is an efficient way to store document data.  And writing this data is actually quite simple, as all we have to do is iterate through every value in the JSON and determine its path; we then write the document in a single batch to Cassandra. On the flip side, reading a document based on its key (the name of the document) is quite easy as well: just get all of the rows that match the document key, and assemble them back into JSON to return to the client. 

One other benefit of this shredding method is that the user can ask for a path within the JSON, such as “what is the value of b.nested?” and it is quite easy to just query for that value and return that relevant row. For those who know Cassandra, note that key is the Partition Key, and p0 through pmax (by default `max` is 63) are part of a compound Clustering Key. This is the storage schema that is created on the fly when you create your first document in a new collection. Stargate manages that creation and maintenance of the Cassandra schema so that you don’t have to!

## Search filters
There are two different search functions that are available with the documents API. You can search within the document for all of the paths that match a predicate, which is perfect for larger documents, and you can search for documents that match a predicate in an entire collection. Both of these search functions allow a set of filters, which are used by sending JSON as a query parameter. The allowed filters are: $eq, $gt, $gte, $lt, $lte, $exists, $ne, $in, and $nin. If multiple filters are supplied, they are executed using AND, since OR is not yet supported natively by CQL. 

There is a bit of subtlety with these filters, however. Some filters ($eq, $gt(e), $lt(e), $exists) translate directly into CQL and therefore can do their filtering in Cassandra, which is fast and efficient on the whole, but the rest ($ne, $in, and $nin) are not natively supported by Cassandra. In order to bridge this gap, we deemed these filters “limited-support” filters, and gave them the following restrictions:

- Data will be fetched from Cassandra *unfiltered* in pages, and as those pages come out the relevant limited-support filters will be applied *in-memory* on the coordinator node (where Stargate runs).
- For a search within a document, the result set must fit within a single Cassandra page. This essentially means that the page-size you request with has to be sufficiently low.

As a result of the above, it is expected that limited-support filters perform poorly for cases where either you are searching for a small set of results within a large document, or if you are searching for a small number of documents in a large collection. Also, if you are using multiple filters (regardless of whether they are limited-support), you will observe a similar performance pattern as of version 1.0.16.

DataStax has published a Cassandra Enhancement Proposal to bring its [Storage-Attached Indexing technology](https://www.datastax.com/blog/eliminate-trade-offs-between-database-ease-use-and-massive-scale-sai-storage-attached) to Cassandra, which will allow more efficient native indexing of this type of filter.

## Improvements, past and planned
The Documents API was in beta in late 2020 and had its first major version released at the end of 2020. As such, there was and still is a lot to improve upon!

The very first issue that was seen after release was an issue of performance. Initial benchmarks showed that against a Cassandra cluster with 2 Stargate nodes and 2 Storage nodes the average latency for reads (under high concurrency) was 40 milliseconds. While not terrible, a great deal of JVM profiling was done to determine where exactly the time was being spent. It was determined that the authentication process was the culprit, as it attempts to read from (and in some cases write to) an internal table each time the user authenticates. 

By keeping this data in a short-lived cache, we could avoid the performance penalty associated with auth. The next thing we noticed was that our endpoints were not utilizing asynchronous execution in quite the manner we wanted. By adding async at the highest level of the HTTP service, we were able to get some performance gains on both read and write. After these two major changes, we began to see average read latencies of between 12 and 18 milliseconds, depending on the version of Cassandra that was being used. Not only that, these changes affected the write path as well, so this change of between 2x-3x was observed for creating and updating documents as well. Not a bad first stab, and there is still more to come!

Another optimization that was made since release was to the “search across collections” functionality. In earlier versions, if you searched across a collection with any filters, you would end up filtering in memory, in the inefficient manner described above. This meant that if you had a table with a million documents that had 10 fields each, a simple $eq filter that matched only a few results would take *minutes* to complete, or time out entirely. A change was made in v1.0.13 that improved the performance in this particular case by querying Cassandra; now that same process takes on the scale of 100 milliseconds. There is still more room for optimization there, which is very promising.

For the future, we are looking into ways to support OR queries, and also ways to use Cassandra for more of these multi-filter AND queries, which would likely improve performance by a ton. As this progresses, we will be benchmark testing at every step to see what kinds of performance improvements we are getting. All in all, I’m very excited to see what future the Document API holds—there is a lot of potential room for improvement, and we are just getting started!

If you would like to contribute to the Documents API or to Stargate in any part, all contributions are welcome. Please go to our GitHub repository: [https://github.com/stargate/stargate](https://github.com/stargate/stargate).