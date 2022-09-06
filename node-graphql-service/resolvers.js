const {StoreManagerService} = require('./store-manager-service')
const { PubSub } = require('graphql-subscriptions')

const storeManagerService = new StoreManagerService()
const pubSub = new PubSub()

const resolvers = {
    Query: {
        hello: () => {
            return 'Hello World';
        },
        // getProducts: (idsArr) => {
        //     // TODO use grpc from store-manager-service.js

        //     const productsStream = storeManagerService.getProducts(idsArr)
        //     return productsStream
        //     // return [
        //     //     {id: 14, name: "Swimwear", color: "Red", price: 53.71, categoryId: 7},
        //     //     {id: 15, name: "Swimwear", color: "Red", price: 53.71, categoryId: 7}
        //     // ]
        // }
    },
    Subscription : {
        getProducts: {
            
        }
    }
}

module.exports = { resolvers }