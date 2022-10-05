---
layout: post
title: "Stargate v2 Beta: Open for extension"
date:   2022-09-11 00:00:00 -0600
synopsis: "An update on Stargate v2 including announcement of the first Beta release"
author_info:
  name:
    first: "Mark"
    last: "Stone"
  picture: "assets/images/stargate-profile.png"
extra_authors: [ "Jeff Carpenter"]
---

Last Friday, we released the first [Beta](https://github.com/stargate/stargate/releases/tag/v2.0.0-BETA-1) for Stargate v2. In this post we’ll look at why this is a major milestone for the project and how you can try out this new release yourself.

## What is Stargate v2?

To answer this question, let’s start with a quick refresher on the Stargate project. We like to refer to Stargate as a “data API gateway” (or data gateway for short) built on top of Apache Cassandra.

In a technology world that is increasingly dominated by cloud data services rather than databases, application developers are likely to think in terms of data abstractions like JSON rather than an idiom unique to a particular database. An API gateway is therefore an ideal way to meet developers where they are, allowing them to work in frameworks and structures familiar to them without having to know all the particulars of the underlying database. Stargate is designed to meet this need – backed by the power of Cassandra, and presenting REST, Document, and GraphQL as developer friendly APIs. We’ve also added a set of gRPC libraries for doing CQL over gRPC as an easier, lightweight, and more cloud friendly alternative to native drivers for CQL.

Stargate v2 represents a significant architectural update for our data API gateway, designed to address several opportunities for improvement we identified in working with the original architecture. In particular:

* Monolith to modular. The original Stargate codebase is too tightly coupled to the persistence engine, making it hard to develop anything without knowing everything. Going forward, we’re factoring out the REST, GraphQL and Document APIs as independent services. Enhancing a particular API service, or adding an entirely new API service, will be much easier, while CQL and gRPC APIs remain in the coordinator node for optimal performance.
* Cloud friendly. Being more service-oriented is of course also more cloud friendly. We’ve created a new “bridge” gRPC API to the coordinator node that makes it easy to create additional API services. Supplying a HTTP-based API allows developers to extend the architecture more quickly compared to traditional the CQL binary protocol and drivers. We’re also moving away from OSGi as our containerization standard, and instead making each service deployable as its own Kubernetes pod. Kubernetes is the de facto standard for cloud deployments, and we’re happy to align with that. This will also improve compatibility with the cloud native version of Cassandra, namely [K8ssandra](https://k8ssandra.io/).
* Operator friendly. By leveraging Kubernetes, we can make each service independently deployable and scalable. This will give operators a lot more control over how they manage and scale Stargate.

What hasn’t changed is our commitment to backward compatibility for all API endpoints. Additionally, Stargate v2 continues to support multiple Cassandra backends including Cassandra 3.11, Cassandra 4.0, and DataStax Enterprise 6.8. Stargate is also deployed as part of DataStax AstraDB, which provides important feedback on usage of Stargate at scale. To learn more about the Stargate v2 effort, check out our other blogs [announcing the project](https://stargate.io/2021/11/02/announcing-stargate-v2.html) and discussing the [design approach](https://stargate.io/2021/11/02/introducing-the-design-for-stargate-v2.html).

## Why it’s time to release a Beta

In our last update on Stargate v2, we [shared the progress](https://stargate.io/2022/01/06/reaching-the-first-milestone.html) on factoring the REST API out of the coordinator node as a separate microservice. Since that time we have created a new “Bridge” gRPC API distinct from the publicly available gRPC API and factored the GraphQL and Document API endpoints out of the coordinator into their own separate microservices. All three API services use the [Quarkus framework](https://quarkus.io/), which enables them to be very lightweight and leverage an up-to-date Java version - JDK 17.

We are now getting close to a Release Candidate, and have a worthy Beta. This enables the open source community to start trying out Stargate v2 at near production quality in a couple of key areas:

* Performance and scalability - we want to give you the opportunity to validate that performance continues to meet your expectations. It will also allow you to explore the new deployment and scaling possibilities of a specific API , deploying only the API services you actually need.
* Extensibility - a key goal of Stargate v2 is the idea that the community should be able to add new API services [more quickly and easily](https://stargate.io/2022/05/23/towards-dynamodb-compatibility-for-cassandra.html). The Bridge API exposed by the Coordinator services is really all that’s needed to add a new API service, and the source code for the REST, GraphQL, and Document API services provide instructive example code of what a finished API service should look like.

The Beta designation is our way of signaling that these facets of v2 are ready for full exploration and testing by the open source community.

## How to run Stargate v2

Now that we have a Beta release, why not give it a try? To make it easier to experiment with the release, we’ve built Docker images and provided Docker Compose scripts in order to spin up Stargate with a backing Cassandra or DSE cluster. The Docker images are available on our [Docker Hub](https://hub.docker.com/u/stargateio) page, but the easiest way to run is to clone the Stargate repo and use the scripts we’ve provided:

```
git clone https://github.com/stargate/stargate.git
cd stargate
git checkout v2.0.0
cd docker-compose
```

From here, you’ll see three subdirectories: `cassandra-3.11`, `cassandra-4.0`, and	`dse-6.8`. Depending on which Cassandra backend you wish to use, there are scripts available to start Stargate in Docker. Let’s look at Cassandra 4.0 as an example:

```
cd cassandra-4.0
./start_cass_40_dev_mode.sh -t 2.0.0-BETA-1
```

The `-t` option defines which version to use, in this case `2.0.0-BETA-1`. We’ve provided these scripts that wrap Docker Compose to make it easier to impose the desired startup sequence. The `start_cass_40_dev_mode.sh` script provides a simple configuration that starts a single instance of the REST and GraphQL APIs and a single instance of the Stargate coordinator in “developer mode”, meaning that the coordinator is running a full Cassandra 4.0 node. Developer mode is a feature that many Stargate users don’t know about but it’s a great option for simple testing. If you’d like to run with a 3-node Cassandra cluster instead, you can use the `start_cass_40.sh` script, again using the `-t` option to specify the desired release.

Once you have a cluster running, it’s a simple matter to generate some test queries against your running instance. The easiest way to do this is to use our recently updated Postman collections. There are three collections available: REST, GraphQL and Docs API. Once you have Postman installed, you can load the collections from the [DataStax workspace](https://www.postman.com/datastax/workspace/datastax-astra-db-stargate/overview) on the Postman website. See the Stargate [documentation](https://stargate.io/docs/latest/develop/tooling.html) for more information.

For example, let’s try running the REST collection against our local Stargate v2 cluster. After loading the collections, make sure to select the “Stargate OSS API Environment” from the pulldown at the upper right (1). This configures settings that will cause Postman to talk to endpoints on your local computer using the default port number. Then select the “Stargate-OSS-Astra-REST-API” collection from the list on the left (2) and run the collection (3).

![postman](/assets/images/stargate-v2-postman.png)

Now you can sit back and watch as Postman uses Stargate’s authentication API to generate a token and use that token to securely invoke operations against your local copy of the Stargate REST API. Try out the other collections as well and let us know what you think.

## We want your feedback

What’s next? In the coming weeks we’ll continue to generate additional Beta releases based on your feedback. We will especially want feedback when we’ve reached what we consider to be a Release Candidate.

You can provide feedback through whatever channel is easiest for you:

* We do our work out in the open, so [Github](https://github.com/stargate/stargate) is a great place to provide feedback, and we use [Github Discussions](https://github.com/stargate/stargate/discussions).
* We also have a [Discord server](https://discord.gg/33mKDHHFUE).
* Or find us on [Twitter](https://twitter.com/stargateio).
* Or [LinkedIn](https://www.linkedin.com/groups/9091327/?lipi=urn%3Ali%3Apage%3Ad_flagship3_groups_index%3BiWk36RDvQXmdJSCjsT5YlQ%3D%3D).