/**
 * intermidiary between graphql and grpc
 * 1. up the docker container for the server: DONE
 * 2. use grpc to get one product by id 
 */
const path = require('path')

const PROTO_PATH = path.join(__dirname, '..', 'djtestpoms/djtestpoms.proto')
const grpc = require('@grpc/grpc-js');

var parseArgs = require('minimist');
var protoLoader = require('@grpc/proto-loader');
const { constants } = require('buffer');
var packageDefinition = protoLoader.loadSync(
    PROTO_PATH,
    {keepCase: true,
     longs: String,
     enums: String,
     defaults: true,
     oneofs: true
    });
// console.log({packageDefinition})
// console.log(packageDefinition['djtestpoms.StoreManager']['GetCategories'])
var djtestpoms_proto = grpc.loadPackageDefinition(packageDefinition).djtestpoms;
const apiKey = 'dQw4w9WgXcQ';

function main() {

  const target = 'localhost:8080';

  const client = new djtestpoms_proto.StoreManager(target,
                                       grpc.credentials.createInsecure());

  const products = client.GetProducts(
    // {ids: [14], apiKey}
    {apiKey, ids: [14, 17, 42, 79, 143] }
    );
 
  products.on('data', (chunk) => { console.log(chunk.product); })

}

main();