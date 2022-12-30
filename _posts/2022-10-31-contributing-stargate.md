---
layout: post
title: "Why and How to Contribute to Stargate"
date:   2022-10-30 00:00:00 -0600
synopsis: "With the Stargate v2 release, it's easier than ever to contribute to the project."
author_info:
  name:
    first: "Mark"
    last: "Stone"
  picture: "assets/images/stargate-profile.png"
---

As an open source project Stargate, the data gateway for Apache Cassandra, has always been open to outside contribution and participation. With [Stargate v2](https://stargate.io/2022/10/26/stargate-v2-ga.html), we’ve taken practical steps to make it easier to  contribute. We value diverse perspectives on how we should evolve Stargate. With diversity of opinion comes greater innovation. Please help us innovate for the benefit of both Stargate and Cassandra.


## Why You Should Contribute to Stargate

All open source projects offer a variety of ways for the open source community to contribute, and Stargate is no different:

* Contribute to our documentation with examples or how-tos.
* Modify the code based one what you want to see in Stargate, and submit a pull request.
* Install and run Stargate for yourself, and make a feature suggestion.
* Find and report bugs.

Historically, as an open source project whose development is driven primarily by one company (DataStax), and whose code base has been both complex and monolithic in nature, the bar to becoming a Stargate contributor has been set pretty high.

Until now, that is. With Stargate v2 we have made the code base more modular, more approachable, and thus easier to contribute to. In fact, we have three specific areas where it would be valuable to the community to receive contributions.

## Extending gRPC Access

The first opportunity to easily contribute to Stargate predates v2. A year ago we released our gRPC API for Stargate, along with a set of gRPC client libraries, as a means of making CQL calls over gRPC as a transit protocol. We also leverage [gRPC protobuf](https://github.com/stargate/stargate/tree/main/grpc-proto/proto) files to create the skeleton of a CQL query engine in whatever language you compile the gRPC library for.

We launched gRPC with client libraries for [Java](https://github.com/stargate/stargate-grpc-java-client), [Go](https://github.com/stargate/stargate-grpc-go-client), [Node.js](https://github.com/stargate/stargate-grpc-node-client), and [Rust](https://github.com/stargate/stargate-grpc-rust-client). Of note is that neither the Node.js nor the Rust libraries were written by developers on the core Stargate team at DataStax. Equally important, the work was done quickly, in each case a few weeks’ of side project effort.

This is by design. The intent is not that the core team will write every library that the community might find useful. The intent is to make writing these client libraries so easy that anyone who sees a need could simply write one for themselves.

## Extending Stargate APIs

Version 2 of Stargate breaks down the monolith and instead isolates each API as a separate service. We still have Stargate coordinator nodes that talk directly to Cassandra via CQL, and for performance reasons we still have the gRPC API and the CQL API talking directly to these coordinator nodes. Our other APIs talk to a new bridge endpoint in the coordinator via gRPC.

{% include image.html file="stargate-v2-high-level.png" description="Figure 1: Stargate v2 High Level Architecture" %}

Previously, in order to extend Stargate you had to understand quite a bit of the code in order to do much of anything. Now someone wanting to add a new HTTP-based API would only have to learn the bridge API, and learn about gRPC networking. This should provide a much lower barrier to entry for extending Stargate with new APIs.

## Extending Stargate to New Data Stores

Right now Stargate only talks to Apache Cassandra as a data store. Given that DataStax is a Cassandra-oriented company, that will always be our focus. Architecturally, though, Stargate could be extended to work with other data stores.

This would be a matter of learning the Stargate coordinator code as a starting point. We grant that this is a higher barrier to entry than learning the bridge code. Anyone with knowledge of the coordinator code and mastery of the internals of another data store should be able to rewrite the coordinator code to talk to that alternate data store, extending Stargate in a fundamentally new way.

## Conclusion

There is no wrong way to contribute to Stargate. While the core Stargate team have our own ideas and incoming requests from DataStax Astra, we don’t want to be on this journey alone, which is a big part of why we wrote Stargate v2.

Those of you in the open source Stargate community will have your own views about what’s important, and what should be prioritized. Engage with us, and share your passionately held views. We can disagree, and in constructive disagreement find a better path forward.

Building knowledge through better documentation; truly the lowest barrier to entry for participation, and maybe the most important:

* Test our [documentation](https://stargate.io/docs)! Where did we get it wrong, or fall behind current functionality in the Stargate platform?
* Give us a write-up of your favorite examples. Quality, approachable reference examples are an essential part of a project.
* Finally figured out something that was initially puzzling? Write a how-to; we love how-tos!

Extending gRPC:

* We’d like to have a Python library.
* We’d also like to have a C# library.
* What would you like to see, or help create?

Extending APIs:

* AWS Dynamo is a great data interface, and it’s specific to AWS. A group of students from Carnegie Mellon University has started work on a [Dynamo-compatible API](https://stargate.io/2022/05/23/towards-dynamodb-compatibility-for-cassandra.html) for Stargate that could make this capability available in multiple clouds.
* What additional APIs would you like to see, or help build?

Extending to new DataStores

* We’d like to cover more variants of Cassandra than just the three we currently cover (Apache Cassandra 3.x/4.x, DataStax Enterprise, and [DataStax Astra DB](https://astra.datastax.com)). AWS Keyspaces, for example, is another Cassandra variant that could benefit from Stargate.
* What additional data stores would you like to see, or contribute to integrating?

The best way to get involved with these efforts is to jump right into the project GitHub. Create an [issue](https://github.com/stargate/stargate/issues), submit a [pull request](https://github.com/stargate/stargate/pulls), or start a new [discussion](https://github.com/stargate/stargate/discussions). We look forward to collaborating with you!

