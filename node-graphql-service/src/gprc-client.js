const path = require('path')

const PROTO_PATH = path.join(__dirname, '..', '..', 'djtestpoms/djtestpoms.proto')
const grpc = require('@grpc/grpc-js')

const protoLoader = require('@grpc/proto-loader')
const packageDefinition = protoLoader.loadSync(
  PROTO_PATH,
  {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true
  })

const djtestpomsProtoLoaded = grpc.loadPackageDefinition(packageDefinition).djtestpoms

module.exports = { djtestpomsProtoLoaded }
