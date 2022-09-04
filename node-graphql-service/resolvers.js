const resolvers = {
    Query: {
        hello: () => {
            return 'Hello World';
        },
        getProducts: () => {
            return [
                {id: 14, name: "Swimwear", color: "Red", price: 53.71, categoryId: 7},
                {id: 15, name: "Swimwear", color: "Red", price: 53.71, categoryId: 7}
            ]
        }
    }
}

module.exports = { resolvers }