const { gql } = require('apollo-server-express')
const { GraphQLJSON } = require('graphql-type-json')

const typeDefs = gql`
    scalar JSON
    scalar JSONObject

    type Order {
        id: Int,
        status: OrderStatus,
        items: ${GraphQLJSON}
    }

    enum OrderStatus {
        CREATED,
        READY_TO_SHIP,
        SHIPPED,
        DELIVERED,
        CANCELLED
    }

    type Category {
        id: Int,
        name: String
    }

    type Product {
        id: Int,
        name: String,
        color: String,
        price: Float,
        category_id: Int
    }

    type Query {
        getProducts(idsArr: [Int]): [Product],
        searchProducts(productName: String): [Product],
        getCategories: [Category],
        getOrders: [Order]
    }
`

module.exports = { typeDefs }
