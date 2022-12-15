---
layout: post
title: "Stargate Community Update December 2022"
date:   2022-12-18 00:00:00 -0600
synopsis: "A summary of community activity since the Stargate v2 GA release and what we're looking forward to in 2023."
author_info:
name:
first: "Jeff"
last: "Carpenter"
picture: "assets/images/stargate-profile.png"
---

Hello Stargate community! It’s hard to believe it's already been two months since the [GA release](https://stargate.io/2022/10/26/stargate-v2-ga.html) of Stargate v2! There’s been a lot of activity on the project since that milestone and we wanted to share a few recent highlights as we begin to close out the year:

* **Dynamo Adapter Prototype** - since February, the Stargate core team have had the privilege of mentoring a team of students from Carnegie Mellon University pursuing their Master of Computational Data Science degree. After sharing about their work in the Spring 2022 semester on the [first half of the project](https://stargate.io/2022/05/23/towards-dynamodb-compatibility-for-cassandra.html), Boxuan Li, Ziyan Zhang and Xiang Yue have now completed a prototype of a [DynamoDB Adapter](https://github.com/stargate/dynamoDB-adapter) for Stargate, which they have generously donated to the Stargate project. You can see a [demo](https://www.youtube.com/watch?v=7ZUD2J8wGLI) on YouTube. We’d love to continue work on this prototype with future student groups or other interested community members, as it is an important validation of the v2 architecture.
* **Helm chart** - in addition to the Docker compose scripts we provide for simple containerized deployment, we’ve added a [Helm chart](https://github.com/stargate/stargate/tree/main/helm) as a new option for deploying Stargate in Kubernetes alongside an existing Cassandra cluster. We’re planning a blog with more detail very soon. For a complete distribution of Stargate with Cassandra on Kubernetes, we hope to have [support for Stargate v2](https://github.com/k8ssandra/k8ssandra-operator/issues/688) in K8ssandra in the near future.
* **Inclusive branch naming** - we have completed the renaming of our default branch to `main`, as announced [previously](https://stargate.io/2021/12/14/announce-github-naming-change.html).
* **Support and deprecation strategy** - the release of v2 has enabled us to start thinking more strategically about how to support the project going forward. We’ve started GitHub Discussions to get your feedback on our plans to phase out support for [Cassandra 3.x](https://github.com/stargate/stargate/discussions/2242), the [REST v1 API](https://github.com/stargate/stargate/discussions/2242), and the [Stargate v1](https://github.com/stargate/stargate/discussions/2294) release series.

In terms of what’s next, there are several exciting areas we’re looking at for the new year:

* **Sizing guidance** - we get frequent requests for how to size and scale Stargate deployments in both vertically (number of instances) and horizontally (hardware resources). We are developing more concrete sizing guidance based on performance profiling of several different configurations and workloads.
* **New APIs** - We’ve started planning some new API work based on the v2 architecture and are interested in your inputs and contributions as well, as Mark Stone shared in his [recent blog](https://stargate.io/2022/10/30/contributing-stargate.html).
* **Cassandra Summit 2023** - we’re looking forward to the first dedicated [Cassandra conference](https://events.linuxfoundation.org/cassandra-summit/) in several years in March 2023. In talking with various community members we’re aware of at least 10 Stargate-related submissions to the CFP, so we’re hopeful that the project will be well represented. Registration for the conference is [open](https://events.linuxfoundation.org/cassandra-summit/register/) and we hope to see many of you there, whether in-person or virtually.

Thanks to everyone for your support of the community and commitment to the idea that [databases need APIs](https://thenewstack.io/why-databases-need-apis/). We wish you a great holiday season and look forward to collaborating with you in 2023!

