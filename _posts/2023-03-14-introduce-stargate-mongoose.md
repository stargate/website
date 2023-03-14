---
layout: post
title: "Introducing Stargate Mongoose and JSON API"
date:   2023-03-13 00:00:00 -0600
subtitle: "Bringing Stargate and Apache Cassandra to a new community of JavaScript developers."
author_info:
  name:
    first: "Jeff"
    last: "Carpenter"
  picture: "assets/images/stargate-profile.png"
---

The Stargate team is excited to share a new initiative that has the potential to bring Stargate and Apache Cassandra to a whole new audience: JavaScript developers. As Mark Stone noted in his recent blog “[API Magic: Building Data Services with Apache Cassandra](https://thenewstack.io/api-magic-building-data-services-with-apache-cassandra/)”, we’re exploring the idea of making Stargate APIs more idiomatic and less Cassandra-centric in order to broaden our community and improve the developer experience. In his follow up post “[Mongoose: Bringing JSON-Oriented Developers to Apache Cassandra](https://thenewstack.io/mongoose-bringing-json-oriented-developers-to-apache-cassandra/)”, Mark discusses why we chose to partner with the JavaScript community, particularly via the [Mongoose.js](https://mongoosejs.com/) project.

This post builds on Mark’s posts to give you a guide to how to try out this new capability. If you’ve been tracking the [Stargate GitHub organization](https://github.com/stargate), you may have already seen some new repositories popping up, or perhaps you’ve seen the presentations at the recent [Cassandra Forward](https://www.cassandrasummit.org/cassandra-forward) online event. In any case, it’s definitely time for us to share what we’ve built so far. We’re adding a couple of new components to the Stargate project, which you can see captured in the following figure.

![Stargate Architecture including stargate-mongoose and JSON API](/assets/images/stargate-mongoose/stargate-mongoose-architecture.png)

The major new pieces are highlighted in the upper left: the stargate-mongoose JavaScript library, and the JSON API. These new components ha have resulted in the addition of three new repositories:

* [stargate/jsonapi](https://github.com/stargate/jsonapi) - this repository contains a new document-oriented API known as JSON API. While Stargate has provided a document-oriented API for some time, feedback we’ve received made it clear that significant improvements were needed. We went back to the drawing board and instead of creating a “Document API v3”, we designed JSON API v1 - a completely new API. This API is more idiomatic to the way developers expect a document-oriented API to work and doesn’t require any Cassandra knowledge to use.
* [stargate/stargate-mongoose](https://github.com/stargate/stargate-mongoose) - this repository extends the hugely popular [Mongoose.js repository](https://github.com/Automattic/mongoose) with the option to use the Stargate JSON API as its storage backend. The [NPM package](https://www.npmjs.com/package/stargate-mongoose) it builds can be used as a drop-in replacement for the [Mongoose](https://mongoosejs.com/) Object Data Modeling (ODM) library, instantly bringing the power and scalability of Apache Cassandra to JavaScript applications.
* [stargate/stargate-mongoose-sample-apps](https://github.com/stargate/stargate-mongoose-sample-apps) - Valeri Karpov, creator of the Mongoose project, has ported three Mongoose sample apps to work with the stargate-mongoose client and graciously donated this code to the Stargate project.

Please note that these are just the initial versions of new software and are currently considered to be of Alpha quality, with Beta and General Availability (GA) releases targeted for both open source and DataStax Astra in the months to come.

We’re doing all this work in public to get as much feedback as early as possible to set the best direction for the project, which is why we’d love to have you take all this for a test drive….


## Getting Started with stargate-mongoose and JSON API

The easiest way to try this out is with our downloadable demo. Start at the [stargate-mongoose-sample-apps](https://github.com/stargate/stargate-mongoose-sample-apps) repository and follow the instructions provided there to run the E-commerce application. You’ll deploy the app as a local [Netlify](https://www.netlify.com/) [Functions](https://www.netlify.com/products/functions/) application, with the supporting infrastructure (JSON API, Stargate Coordinator, Apache Cassandra) running in Docker.

![E-commerce sample app for stargate-mongoose](/assets/images/stargate-mongoose/stargate-mongoose-demo.png)

This is a simple but powerful sample application that demonstrates usage of inserting, finding, and deleting documents using stargate-mongoose and the JSON API. If you’d like to dig more into the details of these components, keep reading for a guided tour.

## Get to know Stargate-mongoose

To get more detail on stargate-mongoose, check out the GitHub repo. Once you’re there you can follow the [quickstart](https://github.com/stargate/stargate-mongoose#quickstart) instructions and then read the developer guide for more details on how the project is built and packaged.

One portion new users may find useful is the feature matrix, which describes which Mongoose operations are supported. We plan to keep this updated as the implementation matures.

## Get to know JSON API

The stargate-mongoose package is all that most JavaScript developers will need, and the Mongoose developer experience is our primary focus for now. Mongoose and other application developers may still be interested in digging into the details of the new JSON API.

The easiest way to experience the JSON API directly is to make use of the new JSON API [project](https://www.postman.com/datastax/workspace/stargate-cassandra/collection/25879866-266032b1-1fe9-4abd-aee9-e6e4b335f921) under the Stargate-Cassandra Postman [workspace](https://www.postman.com/datastax/workspace/stargate-cassandra/overview). You can use the same Docker-based installation described in the previous section, or use the quickstart instructions on the [JSON API README](https://github.com/stargate/jsonapi#readme). The README also describes how you can access the Swagger UI on your local installation.

For a more formal definition of the API, including naming conventions, limits, and error codes, please take a look at the [specifications](https://github.com/stargate/jsonapi/tree/main/docs) under the project docs directory.

Those of you with a Cassandra background may wonder how we are storing JSON documents so that they can be retrieved efficiently. While the original Stargate Docs API used a technique known as [shredding](https://stargate.io/2020/10/19/the-stargate-cassandra-documents-api.html) to break up a document into smaller pieces, there were some shortcomings with this design due to the fact that the pieces were stored in multiple rows in the underlying database. For the JSON API, we’re using an improved approach known as “super shredding” which Aaron Morton described in his talk at [Cassandra Forward](https://www.cassandrasummit.org/cassandra-forward). Stay tuned for an upcoming blog where we’ll discuss super shredding in more detail.

## Your feedback

We’d love to hear feedback on any aspect of this project - the sample applications, specifications, tests and code, compatibility choices - anything and everything! As always, we’re available on [Discord](https://discord.com/invite/HHtMAvjaZB) - see the new #stargate-mongoose and #json-api channels. You can also use issues and discussions on our GitHub repos.


