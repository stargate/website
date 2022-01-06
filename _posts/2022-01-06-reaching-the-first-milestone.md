---
layout: post
title: "Stargate v2 Update: Reaching the First Milestone"
date:   2022-01-06 00:00:00 -0600
synopsis: "The Stargate team is excited to provide an update on our first milestone for Stargate v2."
author_info:
  name:
    first: "Jeff"
    last: "Carpenter"
  picture: "assets/images/stargate-profile.png"
---


# Stargate v2 Update: Reaching the First Milestone


Back in November, we shared the goals of the [Stargate v2 release](https://dtsx.io/3pZJR0R) and our [proposed design approach](https://dtsx.io/3EVeVmJ), and now it’s time for a progress check. To kick off 2022, the Stargate team is excited to provide an update on our first milestone in the continued development of Stargate v2.

For this first milestone, we adopted a “steel thread” approach – our goal was to begin [breaking up the monolith](https://dtsx.io/3pZJR0R) by factoring a single API service out of the Stargate coordinator node – the REST API service. While the original v2 design referenced above includes the introduction of a new gRPC “Bridge” component, we elected to use the new gRPC API that was released in November 2021 as a placeholder for the Bridge in this first milestone, and defer starting work on the Bridge to the next milestone. This enabled us to work more quickly and focus on separating out the new service from the Coordinator Node. The result of what we built is shown in Figure 1 below:

{% include image.html file="steel-thread-image.png" description="Figure 1: Summary of Stargate v2 Milestone 1 implementation." %}

You can find our work on the new standalone REST API service on the <code>[v2.0.0 branch](https://dtsx.io/3n1b5lS)</code> in the <code>[sgv2-restapi module](https://dtsx.io/3zEWule)</code>. While the new REST API service is not production-ready, at the time of writing it is passing over 90% of the integration tests for the REST v2 endpoints. In fact, the easiest way to see the new endpoint in action is to check out the v2.0.0 branch and run the integration test suite as described in the project [README](https://dtsx.io/3qWoJHY). We’re also working on ”Dockerizing” this configuration as well. 

We had some interesting learnings and design discussions that came up along the way. We captured a bunch of them in our retrospective, and then did some affinity mapping to identify common themes. In the sections below, we’ll cover some of the key points that emerged from this exercise. 

## Open discussions

One of our main goals for Stargate v2 has been to make it easier for new contributors to get involved. To help move things in that direction, we’ve started documenting design discussions and proposals via [GitHub discussions](https://dtsx.io/34lzcoF) instead of private Google docs so that the community can benefit and participate. In fact, we’ll link to some of those discussions in the sections below.


## REST API observations

As we were planning Stargate v2, we decided to focus on the architectural refactoring over making improvements to the existing APIs, in order to move quickly and in order to preserve backward compatibility. However, as we worked to make sure the new REST API service worked the same as the existing Stargate v1 REST endpoint, we actually found a few defects and improvements, which we have been documenting in a [GitHub discussion](https://dtsx.io/3pWbB6p) and making equivalent fixes for both Stargate v1 and v2.

As noted above, we have completed the implementation of the majority of the “REST v2” endpoints (e.g. `/v2/keyspaces…`) in the new REST API Service. We did not prioritize implementation of the “REST v1” endpoints (e.g. `/v1/keyspaces/…`) and are investigating how widely used the v1 endpoints are in order to determine the level of interest in bringing those endpoints forward into Stargate v2. Please reach out if you have feedback on this.


## Talking to coordinator nodes via gRPC

We were able to move quickly in implementing the new REST API service by using the new gRPC API exposed by the Stargate coordinator nodes. We’ve started to refer to the style of this interface as “CQL over gRPC” because the operations on the gRPC endpoint work in terms of providing CQL query strings and an array of parameters you wish to bind to the query string. We ended up creating a standalone query builder similar to the one available in the DataStax Java Driver in order to construct CQL strings that the standalone REST service could pass to the gRPC API. This work was not part of our original plan, but we hope it will make implementing subsequent services go more quickly.


## Packaging and releasing for Docker and Kubernetes

As mentioned above, we have an integration test configuration that launches the new REST API service alongside Stargate coordinator and Apache Cassandra**®** nodes. We’re working on updated release processes so that we can have tagged releases for v2, associated Docker images, and example configurations for Docker Compose and Kubernetes. 

Since one of the Stargate v2 goals is to be more Docker/Kubernetes friendly, we’re also working on building Docker images as part of our regular Maven builds so we can make use of the images in local development for unit and integration testing. We’re looking at [Google’s Jib](https://github.com/GoogleContainerTools/jib) as a possible option to replace our current process, which uses a separate [docker-images](https://dtsx.io/3tb0GYq) repo to build Docker images only after a release.  


## What’s next for Milestone 2?

Now that we’ve mostly completed breaking our first API service out of the monolith, we’re working on setting up performance testing, reviewing the architecture, and getting ready to factor the GraphQL and Document APIs into their own services. 

We’d love to hear your inputs about the new architecture and the progress that is being made on the new implementation, so feel free to jump into the conversation on [Discord](https://dtsx.io/3HHolEc) with questions, or comment on our [design discussions on GitHub](https://dtsx.io/3q2tEbj).

_Special thanks to Tatu Saloranta, Olivier Michallat, Doug Wettlaufer and Mark Stone for their contributions to the Stargate v2 effort and this post._
