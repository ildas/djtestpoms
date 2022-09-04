const express = require('express')
const { ApolloServer, gql} = require('apollo-server-express')
const {resolvers} = require('./resolvers')
const {typeDefs} = require('./type-defs')

async function startServer() {
    const app = express()
    const apolloServer = new ApolloServer({
        typeDefs,
        resolvers,
    })

    await apolloServer.start()

    apolloServer.applyMiddleware( { app })

    app.use ((req, res) => {
        res.send('Hello from express apollo server')
    })

    app.listen(4000, () => console.log('Server running on port 4000') )
}

startServer()