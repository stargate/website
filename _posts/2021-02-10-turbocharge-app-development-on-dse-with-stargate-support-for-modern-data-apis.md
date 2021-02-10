---
layout: post
title: "Turbocharge App Development on DSE with Stargate Support for Modern Data APIs"
date:   2021-02-10 00:00:00 -0000
synopsis: "It’s a monumental day for DataStax Enterprise (DSE) users: Stargate support for DSE is here! This means that you can now use REST, GraphQL, and schemaless Document APIs in addition to CQL when building your applications on top of DSE. These APIs are available for use with DSE 6.8."
author_info:
  name:
    first: "Paras"
    last: "Mehra"
  picture: "assets/images/stargate-profile.png"
---

It’s a monumental day for [DataStax Enterprise](https://www.datastax.com/products/datastax-enterprise) (DSE) users: [Stargate](http://www.stargate.io) support for DSE is here! This means that you can now use REST, GraphQL, and schemaless Document APIs in addition to CQL when building your applications on top of DSE. These APIs are available for use with DSE 6.8.

## What’s Stargate?
Stargate is an open source data gateway with built-in extensibility. It allows you to integrate APIs of your choice with any persistence layer. It provides this ability with two components: API services and persistence services. What this means is you can create APIs to connect with various persistence stores, such as DSE.

## Stargate with DSE
With this release, Stargate supports DSE 6.8 as one of these pluggable persistence stores. In order to run Stargate, users will need to add additional nodes to their cluster. These nodes will behave as coordinators in the cluster and no data will be stored on them.

![](/assets/images/turbocharge-app-development-on-dse-with-stargate-support-for-modern-data-apis/stargate-dse-integration-example.png)

## Why Do Enterprises Need Stargate?

**Modern developers need schemaless data.** Building an app and then continuing to iterate is a critical part of accelerating time to market. For too long, developers and DBAs have had to predefine the schema before writing their first line of code. Adding a new field (for a phone number, for example), required an ‘ALTER TABLE’ command, costing even more time. With Stargat`e, Document-based development can use schemaless JSON without the need for defining and modifying schemas during the development life cycle. Your application can now evolve as fast as your customers' needs.

**Modern apps need modern data APIs.** Exchanging data with simple, easy-to-use APIs is a fundamental characteristic of modern data apps. Gone are the days of custom or vendor-specific APIs, many of which don’t work with popular new languages and frameworks such as Java, Python, React, and Spring. GraphQL API usage has doubled annually for the last 5 years ([50%](https://2020.stateofjs.com/en-US/technologies/datalayer/) of developers say they are or will be using GraphQL). And REST is still the gold standard as [63%](https://rapidapi.com/blog/rapidapi-developer-survey-insights/) of all APIs are using REST. Stargate is aligned with building modern apps; it provides REST, Document (JSON) and GraphQL APIs to help developers create applications using the languages and frameworks they know best.

**Modern architecture needs microservices.** Cloud-native applications are predominantly built using a microservices architecture and run via Kubernetes. Stargate was designed with this in mind. It abstracts away backends, enabling developers and architects to focus on interacting with data using modern APIs, and not on specific database implementations. Developers have the freedom to use what languages they know and what fits their requirements to build microservices. These are necessary elements for reducing the friction to build innovative cloud native applications. And by leveraging Kubernetes, Stargate mitigates some of the hurdles associated with a microservices architecture like scalability and resiliency.

> "At Yelp, we are excited about Stargate's vision to be an open-source and cloud-native data access API gateway. We already heavily rely on the reliability and resilience of Cassandra to handle big workloads with zero downtime. Therefore, the ability to abstract Cassandra-specific concepts entirely from app developers and support different API options — like REST, GraphQL and gRPC — will go a long way in removing barriers of entry for new software developers at Yelp."

— [Sirisha Vanteru](https://www.linkedin.com/in/sirishavanteru/), Engineering Manager, Yelp

> "Our team is focused on implementing technology that empowers our customers to innovate and invest for a better future. Currently, it is hard to lift and shift our older driver versions in our data infrastructure. Using Stargate's REST API platform would simplify this and allow us to build modern apps with ease. We are excited to see how we can modernize our architecture with Stargate in Astra."

— [Jon Lau](https://www.linkedin.com/in/jon-lau-10a81363/), Cassandra DB Platform Owner,  Engineer, Macquarie Group

## How To Get Started
Follow our documentation [here](https://stargate.io/docs/stargate/1.0/developers-guide/install/install_dse_68.html) to get started with Stargate. If you’d like to learn more and see how Stargate exposes these endpoints and integrates with DSE, take a look at this [blog post](https://stargate.io/2020/09/14/init-stargate.html) and the [Stargate](https://github.com/stargate/stargate) source code for a deeper dive. The blog post does a great job of explaining the mechanics of Stargate and you can always dig into the code for a more thorough analysis. 

Get started today! [Download Stargate](https://downloads.datastax.com/#stargate) and [sign up for our upcoming webinar](https://www.datastax.com/resources/webinar/create-new-apps-faster-worlds-most-proven-nosql-database-nam)!
