---
layout: post
title: "Stargate and Cassandra 4.0 - Better Together"
date:   2021-07-28 00:00:00 -0600
synopsis: "Six years in the making, Apache Cassandra has reached its 4.0 GA release. This is a big milestone for one of the most important open source projects, and a significant step forward in the world of NoSQL and Fast Data."
author_info:
  name:
    first: "Mark Stone and"
    last: "Doug Wettlaufer"
  picture: "assets/images/stargate-profile.png"
---

Six years in the making, Apache Cassandra has reached its 4.0 GA release. This is a big milestone for one of the most important open source projects, and a significant step forward in the world of NoSQL and Fast Data.

## Highlights in 4.0

This new release brings a lot of exciting features to Apache Cassandra. A few highlights include:
- Java 11 support;
- Virtual tables; 
- Improved streaming. 

For the full list head over to the [official Apache Cassandra docs](https://cassandra.apache.org/doc/latest/new/). After reading over everything Cassandra 4.0 brings to the table you might be wondering, “What more could I need?”. Well, that's where Stargate comes in.

## What Is Stargate?

Stargate is a data gateway providing a multi-model set of APIs through which to interact with your Cassandra database. DataStax runs Stargate as part of [Astra DB](https://www.datastax.com/products/datastax-astra), and Stargate can also be deployed on prem with DataStax Enterprise. And of course Stargate is an open source project in its own right that works with open source Apache Cassandra.

So why does Stargate matter to developers, and to the Cassandra community?

### Focus On What You Care About

For many developers a database is simply a means to an end. We spend our days trying to rapidly deliver incredible applications to benefit our users. Applications typically require some form of data persistence. This may mean direct database access with a driver of some sort but others would rather have an API that allows them to think about and interact with their data in a more familiar vernacular. At this point we're typically left to either spin up yet another data service or add a new endpoint to our already growing data proxy. But now there's another option, Stargate. 

When we say Stargate is multi-model, this is the problem we're solving. Whatever a developer's preferred API for data interactions, Stargate offers a single gateway to support that API. Rather than incurring the cost of supporting an ancillary service in order to expose, say, a new GraphQL API to interact with your data you can instead install Stargate as part of your Cassandra cluster leaving more time to focus on what you really care about, your users.

### Any Way You Want It

As discussed in our [previous blog](https://stargate.io/2020/09/14/init-stargate.html), Stargate is an “open source data gateway” that provides multiple APIs for interacting with your data in a familiar and secure manner. You could grab the Cassandra driver for the language of your choice and start developing from there (an option completely supported by Stargate), and now you can also choose one of the APIs supported by Stargate that you're already familiar with such as:

-	REST
-	Documents API
-	GraphQL
-	gRPC

The REST API in Stargate enables you to work with your data in a RESTful format. It exposes a complete CRUD interface for your entire data lifecycle, from schema creation to data manipulation and retrieval. Additionally, there is the Documents API that allows for data management in a schemaless manner which allows for fast iteration without worrying about data modeling. See [this blog article](https://stargate.io/2020/10/19/the-stargate-cassandra-documents-api.html) for a deeper dive into the Documents API. Aside from the more traditional, RESTful interfaces there is also the GraphQL API. This API allows you to interact with your data in either a [cql-first](https://stargate.io/docs/stargate/1.0/developers-guide/graphql-using.html) or [schema-first](https://stargate.io/docs/stargate/1.0/developers-guide/graphql-first-using.html) manner. This new schema-first version is a reimagining of the original cql-first API and provides a more GraphQL native interface that should be familiar to any GraphQL developer. Finally, there is the gRPC API currently in alpha. This new API brings with it all of the existing gRPC and HTTP/2 benefits while still accepting the CQL you're used to.

### Getting Started
Now that we've highlighted how Stargate can make Cassandra 4.0 even easier to work with, it's time to give it a spin. Starting with v1.0.31 [Stargate Docker images](https://hub.docker.com/r/stargateio/stargate-4_0) will support Cassandra 4.0 GA versions and beyond. Check out [our docs](https://stargate.io/docs/stargate/1.0/developers-guide/install/install_cass_40.html) and [examples](https://github.com/stargate/docker-images/tree/main/cassandra-4.0) for simple getting started instructions.

## What 4.0 Means for Stargate

Since pre-v1.0 Stargate we've supported Apache Cassandra 4.0. We've been there for alphas, betas, and release candidates but today we're happy to announce that Stargate supports the official Apache Cassandra 4.0 GA release.

This is an evolutionary change for Stargate more than a ground-breaking step. To bring the flexibility and ease of use that Stargate offers to as many developers as possible, we have always targeted multiple platforms (open source Apache Cassandra, Astra DB, and DataStax Enterprise) as well as multiple versions of Apache Cassandra (3.x and now 4.x). So you don't need to worry about breaking changes or backwards compatibility. Stargate will continue to support these platforms and versions going forward.

Features like improved internode messaging will benefit Stargate, but we don't have to do anything in Stargate to receive those benefits; they'll happen organically below the Stargate coordinator layer. Features like improved streaming offer new opportunities for streaming support in Stargate which we hope to take advantage of in the future. For now rest assured that new streaming features in Stargate will be planned to work with both 4.x and 3.x.

The world's most scalable open source database just got better. As a result, Stargate got better too. 
