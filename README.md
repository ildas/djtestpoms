# DataJet test task: GRPC Server

This is a small GRPC server, providing the service functionality to manage products, categories and orders.
An example client is provided for informational purposes; the `protobuf` service description is located in `djtestpoms/djtestpoms.proto`.

## How to run

For convenience, the `Dockerfile` is provided to build and run this server.

```bash
docker build -t djtestpoms .
docker run -p8080:8080 djtestpoms --api-key $API_KEY
```

## Task description

Please implement a small Apollo/GraphQL service, that consumes data from the gRPC service and exposes it to the users via the GraphQL API.

- the service should accept the API key as an environment variable
- all of the endpoints must be protected with an Bearer Authorization schema
  - No need to implement authorization; Auth token can be static, and also passed as en environment variable
- GraphQL schema must be well defined
- Basic error management must be implemented

## Solution

Please run the following code snippet

```bash
cd node-graphql-service
npm run start
```

You can check the implementation of graphql by going to localhost:4000/graphql
