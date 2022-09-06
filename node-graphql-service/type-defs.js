const { gql } = require('apollo-server-express')


const typeDefs = gql`
    type Product {
        id: Int,
        name: String,
        color: String,
        price: Float,
        category_id: Int
    }

    type Query {
        hello: String,
    # getProducts: [Product]
    }

    type Subscription {
        getProducts : Product
    }


`

module.exports = {typeDefs};