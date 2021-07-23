---
layout: post
title: "Blasting Off into Stargate using HTTPie"
date:   2021-04-08 00:00:00 -0000
synopsis: "As a DataStax Developer Advocate, my job is to help our amazing teams provide you with the best possible experience with Cassandra and our products."
author_info:
  name:
    first: "Kirsten"
    last: "Hunter"
  picture: "assets/images/stargate-profile.png"
---

As a DataStax Developer Advocate, my job is to help our amazing teams provide you with the best possible experience with Cassandra and our products.

Datastax [Astra](https://dtsx.io/workshop) is built on Apache Cassandra. In addition to great [documentation](https://docs.astra.datastax.com/docs), Astra offers a robust free tier that can run small production workloads, pet projects, or just let you play—all for free, no credit card required. Cassandra can be tricky for hardcore SQL developers, because it uses a different slightly different query language (CQL), but when you get Astra, Stargate is there to let you interact with your data through APIs. Our open source [Stargate](https://stargate.io/) product provides REST, GraphQL, and schemaless document APIs in addition to native language drivers. If you like them but don’t want to use our products, that’s fine!  It’s completely open source and you can implement it on your own system.

One of the things I noticed when I arrived at DataStax is that our tutorials rely heavily on curl for performing commands against our APIs. I prefer HTTPie, a similar tool designed for REST API interaction.So I created an authentication plugin for the HTTPie tool that stores your variables and lets you make requests like:

{% highlight javascript %}
http:/v2/schemas/keyspaces
{% endhighlight %}

I've put together a [Katacoda scenario](https://katacoda.com/datastax/scenarios/httpie-astra) for you to see how everything works. If you want to implement it locally, here are the instructions:

The first secret to this is an rc file (~/.astrarc), which keeps track of your DB, region, username, and password, and auto-refreshes your token. You can have as many sections in this file as works for you—it’s just an INI-style configuration file. 

The second secret is the HTTPie configuration file, in ~/.config/httpie/config.json

My configuration is what you see here; I have the “fruity” color scheme, my default auth-type is astra, and the section of the .astrarc file is “default”.

{% highlight javascript %}
{
"default_options": [
  "--style=fruity",
  "--auth-type=astra",
  "--auth=default:"
]
}
{% endhighlight %}

My goal here is to make it so you can bounce around between REST and GraphQL queries, get nicely formatted JSON results, and perhaps use jq to pare them down—but mostly I want for the tool to get out of your way.

Interested?  At this point httpie-astra requires python 3.5, but if you want me to make it support 2.7, please just let me know in the [Datastax Community](https://community.datastax.com/index.html) or on Discord.

You can get it through github:
git clone https://synedra-datastax/httpie-astra

Or with pip:
pip3 install httpie-astra

Once you’ve got it installed, get your environment set up by making a simple call like:

http --auth-type astra -a default: :/v2/schemas/keyspaces

This will give you instructions to get all your variables set up.

Let’s take a look at an example from our Astra REST documentation.

The curl command looks like this:

{% highlight curl %}
curl --request GET \
--url https://${ASTRA_CLUSTER_ID}-${ASTRA_CLUSTER_REGION}.apps.astra.datastax.com/api/restv2/schemas/keyspaces/${ASTRA_DB_KEYSPACE}/tables/products
\
--header 'accept: application/json' \
--header 'x-cassandra-request-id: {unique-UUID}' \
--header "x-cassandra-token: ${ASTRA_AUTHORIZATION_TOKEN}"
```

Then it gives you back a single line JSON doc.

```
{"data":{"name":"products","keyspace":"tutorial","columnDefinitions":[{"name":"id","typeDefinition":"uuid","static":false},{"name":"created","typeDefinition":"timestamp","static":false},{"name":"description","typeDefinition":"varchar","static":false},{"name":"name","typeDefinition":"varchar","static":false},{"name":"price","typeDefinition":"decimal","static":false}],"primaryKey":{"partitionKey":["id"],"clusteringKey":[]},"tableOptions":{"defaultTimeToLive":0,"clusteringExpression":[]}}}
{% endhighlight %}

The httpie command already knows a lot of this information, so the call is much simpler. I’m using the config.json I described above to set my auth-type and config section. I’ll show this output as a screen shot because it’s really easy to understand:

![](/assets/images/blasting-off-into-stargate-using-httpie/httpie.png)

We’re on the job, getting the Stargate examples and Astra API examples to include HTTPie tabs, but in the meantime if you’re having fun with this, please let me know in the community or discord, and let’s make this rock for you!
