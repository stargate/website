---
layout: post
title: "Say Goodbye to Native Drivers with Stargate gRPC API in Java"
date:   2021-11-29 00:00:00 -0600
synopsis: "Developers should be able to build highly scalable apps even when they call multilingual and multi-cloud microservices. That’s why the Stargate team recently made a new API generally available to help developers build applications with their preferred language."
author_info:
  name:
    first: "Tomasz"
    last: "Lelek"
  picture: "assets/images/stargate-profile.png"
---

Developers should be able to build highly scalable apps even when they call multilingual and multi-cloud microservices. That’s why the Stargate team recently made a new API generally available to help developers build applications with their preferred language.

The new API is called [gRPC Remote Procedure Call](https://dtsx.io/2Z2nCfU) (gRPC), and we built it on the framework created by Google. In this post, we’ll show you how easy it is to start using this API from the Java ecosystem. We’ll also explain the basic methods exposed to the clients that allow us to interact with the gRPC API.

The setup is simple. The generated code based on protobuf files (`query.proto` and `stargate.proto`) is shipped with the `grpc-proto` dependency. In your client application, you only need to add two dependencies, the client and a functional channel service provider. In this example we picked netty:

```xml
<dependencies>
    <dependency>
        <groupId>io.stargate.grpc</groupId>
        <artifactId>grpc-proto</artifactId>
        <version>1.0.40</version>
    </dependency>
    <dependency>
         <groupId>io.grpc</groupId>
         <artifactId>grpc-netty-shaded</artifactId>
         <version>1.40.1</version>
    </dependency>
</dependencies>
```

If you don’t add the `grpc-netty-shaded`, you’ll get the following error:

```sh
No functional channel service provider found. Try adding a dependency on the grpc-okhttp, grpc-netty, or grpc-netty-shaded artifact.
```

Once we have all the needed dependencies we should be able to use the Stargate gRPC-stub API.

After this step, you should have `StargateGrpc` available on your classpath from the `grpc-proto` dependency. It contains the logic for interacting with Stargate gRPC API.

## Putting the Stargate gRPC API to use

Once we have the generated code with the `StargateGrpc` class shipped within `grpc-proto` dependency, we’re ready to create the client.

Before delving into the code, we need to generate the auth token that will be used to perform authorization. Please visit the [Stargate Authz documentation](https://dtsx.io/3csSw47) for a guide on this. Here’s some code that will work for our needs:

```sh
curl -L -X POST 'localhost:8081/v1/auth' \
-H 'Content-Type: application/json' \
--data-raw '{
    "username": "cassandra",
    "password": "cassandra"
}'
```

In this snippet, we’re assuming that Stargate is running on the `localhost:8081`. Once we have that, we can connect to the gRPC API. First, we need to generate the `Channel` that is used to perform the connection:

```java
public ManagedChannel createChannel(String host, int port) {
    return ManagedChannelBuilder.forAddress(host, port).usePlaintext().build();
}
```

Please note that `usePlaintext()` should only be used for development and testing. When used in a production environment it should use a load balancer that terminates transport layer security (TLS). For local development of Stargate, it will be:

```java
ManagedChannel channel = createChannel("localhost", 8090);
```

Next, we can generate the `StargateGrpc` stub. There are two ways of interacting with the gRPC API. The first one is synchronous (blocking):

```java
import io.stargate.grpc.StargateBearerToken;

StargateGrpc.StargateBlockingStub blockingStub = StargateGrpc.newBlockingStub(channel)
     .withCallCredentials(new StargateBearerToken("token-value"))
```

The second way of interacting is asynchronous (non-blocking):

```java
StargateGrpc.StargateStub = StargateGrpc.newStub(channel)
        .withCallCredentials(new StargateBearerToken("token-value"));
```

We will focus on the blocking approach in this example since it is simpler to illustrate. Please be aware that for your use case you might need to use the second approach.

We need to set up the `CallCredentials`, using the `token-value` generated in the previous step. We will assume that all queries are executed within the existing keyspace `ks` and table `test`. The table definition is as follows:

```sql
CREATE TABLE IF NOT EXISTS test (k text, v int, PRIMARY KEY(k, v));
```

The Stargate gRPC API provides a way to execute two types of queries: Standard CQL queries and batch queries containing N CQL queries.


## Build and execute a standard query with the gRPC API

When we want to run a standard query we can start by inserting a record using the gRPC stub:

```java
import io.stargate.proto.QueryOuterClass.Response;
import io.stargate.proto.QueryOuterClass;

Response response = blockingStub.executeQuery(
        QueryOuterClass.Query.newBuilder()
            .setCql("INSERT INTO ks.test (k, v) VALUES ('a', 1)")
            .build()
    );
```

This will build and execute a single query. Next, we can retrieve the inserted record(s):

```java
Response response = stub.executeQuery(
    QueryOuterClass.Query.newBuilder()
        .setCql("SELECT k, v FROM ks.test")
        .build()
);
```

If we print out the result set, it will have the following structure:

```sh
result_set {
  data {
    type_url: "type.googleapis.com/stargate.ResultSet"
    value: "some_binary_data"
  }
}
```

The value contains the binary data, that we can deserialize. First, we need to unwrap the result set:

```java
ResultSet rs = response.getResultSet();

rs.getRows(0).getValues(0).getString(); // it will return value for k = "a"
rs.getRows(0).getValues(1).getInt(); // it will return value for v = 1
```

We can get all rows with the `getRowsList()` method and iterate over the result or get the specific row using its index and pass it to the `getRows(int index)` method. We picked the latter approach in the example above.

Our retrieval query (`SELECT k, v FROM ks.test`) stated explicitly which columns should be retrieved. Because of that, we can safely get the values using their positions via the `getValues()` method.

The `getString()` and `getInt()` perform deserialization of data. These methods were used because we knew the underlying type of the corresponding columns. The API provides utility methods for deserialization for more types as well. For the full list of available types, see `value` section in the [`query.proto`](https://dtsx.io/3nxrgYI) file. If you want to iterate over all results, you can with this snippet:

```java
for(QueryOuterClass.Row row: rs.getRowsList()){
      System.out.println(row.getValuesList());
}
```

This will allow you to operate on a single row. When you execute it, you’ll get the following:

```sh
[string: "a"
, int: 1 ]
```

## Run Batch queries with Stargate gRPC API

In case we want to execute N queries, we can use the `executeBatch` method:

```java
QueryOuterClass.Response response = blockingStub.executeBatch(
    QueryOuterClass.Batch.newBuilder()               
        .addQueries(
            QueryOuterClass.BatchQuery.newBuilder()
                .setCql("INSERT INTO ks.test (k, v) VALUES ('a', 1)").build()
         )          
         .addQueries( 
             QueryOuterClass.BatchQuery.newBuilder()
                 .setCql("INSERT INTO ks.test (k, v) VALUES ('b', 2)").build()
                 )
                 .build()
 );
```

This takes the `Batch` as an argument. A `Batch` can contain N queries of type `INSERT`, `UPDATE`, or `DELETE`. We are adding two queries via the `addQueries` method. You can learn more about handling the `Batch` request in the [Batch Documentation](https://dtsx.io/3cs7doc).

Now you know how to integrate the gRPC client via `blockingStub`. If you want to dive deeper into it take a look at the [Java Client documentation on gRPC](https://dtsx.io/2Z2nCfU).


## Resources

1. [Join the Stargate community](https://dtsx.io/3qTlaUL)
2. [Using Stargate gRPC API clients for Rust, Go and Node.js](https://dtsx.io/2Z2nCfU)
