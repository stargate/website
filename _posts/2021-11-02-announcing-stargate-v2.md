---
layout: post
title: "Announcing Stargate v2"
date:   2021-11-02 00:00:00 -0600
synopsis: "After a year of adding new APIs and features, we realized that this is an ideal time to take a step back and look at the overall architecture of Stargate. We’re listening to feedback from the Stargate developer community and taking a look at our technical debt as well. Based on your inputs, we’ve begun some planning for a Stargate v2."
author_info:
  name:
    first: "Jeff"
    last: "Carpenter"
  picture: "assets/images/stargate-profile.png"
---

After a year of adding new APIs and features, we realized that this is an ideal time to take a step back and look at the overall architecture of [Stargate](https://dtsx.io/3jNJGlR). We’re listening to feedback from the [Stargate developer community](https://dtsx.io/3bsmhS4) and taking a look at our technical debt as well. Based on your inputs, we’ve begun some planning for a “Stargate v2” and have identified the following high-level goals: 

* Breaking up the monolith
* Improving developer experience for contributors
* Making Stargate more cloud-friendly

We’ll expand on these goals below, but first let’s take a look at how we got to this point.


## Stargate: a brief history

In September 2020 we [announced the Stargate project](https://dtsx.io/3jQRa7D) as an open-source data gateway. Our goal was (and continues to be) to help speed up application development and reduce the workload for teams that find themselves creating and maintaining layers of microservice APIs on top of databases like [Apache Cassandra®](https://cassandra.apache.org/_/index.html). 

Since that first release, which included support for CQL and REST APIs, the project has seen a number of milestones since then. Here are a few of the highlights:

* Addition of the [GraphQL API](https://dtsx.io/3EsZUsp) and the [Document API](https://dtsx.io/3blyRCT), with a gRPC API coming soon
* Reaching the [1.0 milestone](https://dtsx.io/2Y0PNLU)
* Support for [Cassandra 4.0](https://dtsx.io/3pTsDT5) 
* Adoption of Stargate as the official API layer for [DataStax Astra DB](https://dtsx.io/3nMs4bg)

This represents a lot of change for a project that’s just over a year old, and now it’s time for us to set the stage for this open-source community to grow even more.


## Breaking up the monolith

The current Stargate design is monolithic; that is to say, each Stargate node runs as a single process containing all of the supported APIs. This has a few consequences for deploying and running Stargate:

* All of the APIs are enabled by default. You could run your own version with individual APIs disabled, but not by using the official Stargate Docker images. Instead, you’d have to download and build the Stargate source and selectively omit specific OSGI bundles from the startup script. This isn’t intuitive and requires knowledge of the existing bundles (more on OSGI below).

* More importantly, it’s not possible to scale the individual APIs. For example, if you’re primarily using the REST API and need to scale up to meet increased REST traffic, you can’t just scale up REST independently. Instead, you have to add additional Stargate nodes supporting all the APIs to meet the demand. The nodes are “heavier” than they need to be, leading to inefficient resource usage.

* Today, extending Stargate with a new API requires creating a new module, adding the module’s Jar file to the existing stargate-lib directory, and then packaging all the Jars and configuration up for deployment.

As you can see, the current design makes Stargate more difficult for both users and contributors, and it’s time to break up this monolith to improve the experience for everyone.


## Improving the developer experience for users

As you’d expect, we absolutely want the Stargate APIs to be as easy to use and adopt as possible, but our goals for v2 are specifically focused on making Stargate easy to deploy and manage, rather than on making API revisions.

Stargate v2 will move the API implementations out of the Stargate node (aka “monolith”) into separate microservices. This will allow you to scale each API independently. You can even disable APIs that you don’t intend to use entirely, allowing you to focus on a smaller surface area of the project and giving you fewer endpoints to secure.


## Improving the developer experience for contributors

We’re also committed to growing the community of open source developers who are actively contributing code to Stargate. For this reason, another major goal of v2 is to make the implementation itself easier to understand, debug, enhance, and extend.


### Removing OSGI

The original Stargate (“v1”) has a pluggable design, using the [OSGI framework](https://www.osgi.org/) to allow different modules to be composed at deployment time. This is useful for swapping in different Cassandra persistence modules, such as Cassandra 3.11, 4.0, and DataStax Enterprise 6.8. We chose OSGI because it’s a proven technology that provided us with the plugin framework we needed to iterate quickly.

However, OSGI isn’t widely used these days, and several developers have reported that debugging can be difficult due to the nuances of working with OSGI. The move to microservices will help reduce the need for OSGI, and we’ll work toward replacing the remaining usage with another solution.


### Encouraging modernization and innovation

The current requirement to support a Cassandra 3.11 persistence layer means that the Stargate nodes must run Java 8 — the lowest common denominator. Unfortunately, this has prevented the usage of more modern Java frameworks, such as Quarkus or Micronaut that require later Java versions.

We believe that one of the great benefits of breaking up the monolith will be to encourage innovation in the Stargate community. The v2 architecture will be more conducive to external contributions since the developer of each microservice will be able to make their own choices about what language and frameworks to use. This has the dual benefit of both modernizing Stargate and potentially attracting contributors who are interested in working with new and exciting frameworks or languages.


### Refactoring and cleanup

As with any project that has many contributors, the codebase has started to show some entropy. Although it’s nowhere near “spaghetti code” state, the modules and Java package structure could use some refactoring. We’re hoping to clean up some dependencies and improve the overall code organization to make it easier for you to find your way around.


## Making Stargate more cloud-friendly

While the Stargate project currently provides [Docker images](https://dtsx.io/3myshiV) that can be used for deployment in containerized environments, Stargate v2 is going to add additional images for the various microservices. This will add some complexity to deployments.

Since [Kubernetes](https://kubernetes.io/) has emerged as the clear choice for container orchestration in both public and private clouds, v2 will provide assistance in deploying Stargate on Kubernetes via Helm. We envision providing a Helm chart to expose each enabled API as a Kubernetes Service, use Deployments to manage replicas of the API implementations, create a StatefulSet to manage the persistence nodes, and so on.

On another note, we look forward to continuing our collaboration with the [K8ssandra](https://dtsx.io/3Erl8Xr) project, which provides deployments of Stargate and Cassandra on Kubernetes. The K8ssandra team is also building a [Stargate Controller](https://dtsx.io/3vYmeqJ) as part of the [K8ssandra Operator](https://github.com/k8ssandra/k8ssandra-operator) for their own v2 release. 


## The journey to V2 is just beginning

We’re just getting started on working toward a Stargate v2 release and are committed to sharing our plans and progress early and often. We’d love to get as much input as possible from the [Stargate open source community](https://dtsx.io/3bsmhS4). In our next blog post, we’ll introduce a proposed design for Stargate v2, other design options we considered, and share how you can provide feedback on the proposal. 


## **Resources**

1. [Stargate.io](https://dtsx.io/3jNJGlR)
2. [Stargate Community](https://dtsx.io/3bsmhS4) 
3. [Stargate and Cassandra 4.0 - Better Together](https://dtsx.io/3pTsDT5)
4. [K8ssandra - K8ssandra, Apache Cassandra® on Kubernetes](https://dtsx.io/3Erl8Xr) 
