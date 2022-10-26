---
layout: post
title: "Stargate v2 is Generally Available"
date:   2022-10-26 00:00:00 -0600
synopsis: "Announcing the GA release of Stargate v2 and how to migrate from v1 to v2"
author_info:
  name:
    first: "Jeff"
    last: "Carpenter"
  picture: "assets/images/stargate-profile.png"
---

Back in September, we announced the availability of the [Stargate v2 Beta release](https://stargate.io/2022/09/11/stargate-v2-beta.html). After several betas and a release candidate, we’re excited to announce the availability of the general release of Stargate v2!

As we’ve discussed in [previous posts](https://stargate.io/2021/11/02/announcing-stargate-v2.html), v2 represents an architectural refactoring that allows more flexible deployments and makes it easier to create new APIs.

The GA release includes the results of community feedback as well as learnings from the DataStax team on integrating Stargate v2 into [DataStax AstraDB](https://astra.datastax.com), which have served to inject a high level of confidence in the quality of this release.

## Quickstart for v2

If you want to try out the v2 release, we have everything set to go. In the [Beta release blog](https://stargate.io/2022/09/11/stargate-v2-beta.html), we provided instructions on how to quickly deploy Stargate v2 on your desktop using Docker compose, and then use Postman collections to exercise the APIs.

We also recommend checking out Pieter Humphrey’s [blog post](https://medium.com/building-the-open-data-stack/stargate-brings-apache-cassandra-to-the-postman-api-network-a18d973714b) for a more in-depth introduction to these collections and how to use them.

## Migrating to v2

If you’re currently using Stargate v1 and are ready to upgrade to v2, the process is straightforward. For users that are only using gRPC and CQL APIs, you only need to update your configuration to run the v2 version of the coordinator. Restarting nodes in your backing Cassandra cluster is not required, and you can use a rolling restart approach to update coordinator nodes and your clients for a zero-downtime update.

In addition, if you’re using Stargate HTTP APIs such as REST, GraphQL or Docs API, you will need to run instances of each API service you need. These APIs are packaged as separate containers from the v2 coordinator node.

We recommend running at least two instances of each API service you use to ensure high availability, as shown in the figure. The good news is that this will not consume a large amount of additional resources, since all three API services use the [Quarkus framework](https://quarkus.io/) to create lightweight container images based on JDK 17. For more detail see Ivan Senic’s recent interview on the [Quarkus Insights podcast](https://www.youtube.com/watch?v=nBX-J4LgEog).

{% include image.html file="stargate-v2-high-level.png" description="Figure 1: Stargate v2 High Level Architecture" %}

Images for the coordinator and API services are available on [Docker Hub](https://hub.docker.com/u/stargateio), and we’ve also made sample Docker compose configurations available in the Stargate GitHub repository.

In order to complete a migration of your HTTP clients to the new APIs, you’ll want to repoint your clients to the new API endpoints. If you’ve deployed a load balancer in front of the Stargate HTTP APIs in v1 deployments, this will be a trivial change requiring no downtime.

* All of the default port numbers are the same, with the exception of the Documents API.
* Paths for APIs move to the new services, including developer tools like Swagger and GraphQL playground
* The REST v1 API remains on the coordinator node, we’re actively discussing how long to maintain this original version of the REST API, but for the moment it is not supported by the v2 REST API service.

For more details on ports and paths for v2, see the table below.

| API                      | v1 URLs                                                                                                                                                                  | v2 URLs                                                                                                                                                                                                                                                                                                 | Note                                                                         |
|--------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|------------------------------------------------------------------------------|
| Metrics                  | <code>http://&lt;coordinator>:8084/metrics</code>                                                                                                                        | <code>http://&lt;coordinator>:8084/metrics</code><br><code>http://&lt;restapi>:8082/metrics</code><br><code>http://&lt;docsapi>:8180/metrics</code><br><code>http://&lt;graphqlapi>:8080/metrics</code>                                                                                                 | New metrics endpoints for API services, coordinator unchanged                |
| Health                   | <code>http://&lt;coordinator>:8084/checker/liveness</code><br><code>http://&lt;coordinator>:8084/checker/readiness</code>                                                | <code>http://&lt;coordinator>:8084/checker/liveness</code><br><code>http://&lt;coordinator>:8084/checker/readiness</code><br><code>http://&lt;restapi>:8082/stargate/health</code><br><code>http://&lt;graphqlapi>:8080/stargate/health</code><br><code>http://&lt;docsapi>:8180/stargate/health</code> | New health endpoints for API services, coordinator unchanged                 |
| Auth API                 | <code>http://&lt;coordinator>:8081/v1/auth/token/generate</code>                                                                                                         | <code>http://&lt;coordinator>:8081/v1/auth/token/generate</code>                                                                                                                                                                                                                                        | No change                                                                    |
| gRPC                     | <code>http://&lt;coordinator>:8090</code>                                                                                                                                | <code>http://&lt;coordinator>:8090</code>                                                                                                                                                                                                                                                               | No change                                                                    |
| REST v1   | <code>http://&lt;coordinator>:8082/v1/keyspaces</code>                                                                                                                   | <code>http://&lt;coordinator>:8082/v1/keyspaces</code>                                                                                                                                                                                                                                                  | No change, legacy REST v1 remains on coordinator                             |
| REST v2  | <code>http://&lt;coordinator>:8082/v2/keyspaces</code><br><code>http://&lt;coordinator>:8082/v2/schemas/keyspaces</code>                                                 | <code>http://&lt;restapi>:8082/v2/keyspaces</code><br><code>http://&lt;restapi>:8082/v2/schemas/keyspaces</code>                                                                                                                                                                                        | REST v2 APIs move to new service                                             |
| Docs API                 | <code>http://&lt;coordinator>:8082/v2/namespaces</code><br><code>http://&lt;coordinator>:8082/v2/schemas/namespaces</code>                                               | <code>http://&lt;docsapi>:8180/v2/namespaces</code><br><code>http://&lt;docsapi>:8180/v2/schemas/namespaces</code>                                                                                                                                                                                      | Docs APIs move to new service, port number changed to 8180                   |
| Swagger                  | <code>http://&lt;coordinator>:8082/swagger-ui</code>                                                                                                                     | <code>http://&lt;coordinator>:8082/swagger-ui</code><br><code>http://&lt;restapi>:8082/swagger-ui</code><br><code>http://&lt;docsapi>:8180/swagger-ui</code>                                                                                                                                            | REST v1 swagger remains on coordinator, REST v2 and Docs API on new services |
| GraphQL                  | <code>http://&lt;coordinator>:8080/graphql-schema</code><br><code>http://&lt;coordinator>:8080/graphql-admin</code><br><code>http://&lt;coordinator>:8080/graphql</code> | <code>http://&lt;graphqlapi>:8080/graphql-schema</code><br><code>http://&lt;graphqlapi>:8080/graphql-admin</code><br><code>http://&lt;graphqlapi>:8080/graphql</code>                                                                                                                                   | GraphQL APIs move to new service                                             |
| Playground        | <code>http://&lt;coordinator>:8080/playground</code>                                                                                                                     | <code>http://&lt;graphqlapi>:8080/playground</code>                                                                                                                                                                                                                                                     | GraphQL Playground moves to new service                                      |
| Bridge                   | N/A                                                                                                                                                                      | <code>http://&lt;coordinator>:8091</code>                                                                                                                                                                                                                                                     | New in v2 for building API services                                          |

Regardless of your particular deployment, no application code changes should be required (beyond any configuration updates required to point to new endpoints), as all Stargate v2 API implementations are backward compatible with v1 implementations.

Some users may be deploying Stargate as part of a K8ssandra cluster. We’re [actively collaborating](https://github.com/k8ssandra/k8ssandra-operator/issues/688) with the K8ssandra team on extending the K8ssandra operator to be able to deploy and scale Stargate v2, including both the coordinator node and the new API services.

## What Comes After v2?

As we move forward, we’ll continue to maintain the support of existing APIs and work toward modernization of the coordinator node including JDK updates, Quarkus adoption, and removal of OSGI from the coordinator.

We’re also excited for the possibility of developing new APIs. The [Dynamo API prototype](https://stargate.io/2022/05/23/towards-dynamodb-compatibility-for-cassandra.html) developed as a masters project by a team of students from Carnegie Mellon University has served as a valuable proof point of the extensibility of the v2 architecture.

In our next blog we’ll talk more about how you can contribute to the Stargate project, whether by creating new examples, adding APIs, or extending the coordinator node.
