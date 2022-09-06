const { StoreManagerService } = require('./store-manager-service')

const storeManagerService = new StoreManagerService()

const resolvers = {
  Query: {
    /**
     * @param {object} parent
     * @param {object} args contains the arguments passed to the getProucts query
     * @returns {Product[]}
     */
    getProducts: async (parent, args) => {
      const productsStream = storeManagerService.getProducts(args.idsArr)

      // this way of getting products out of the productsStream is incorrect. It will fail if
      // there are millions of productws. The correct thing to do is subscribe to a create product mutation
      // and get in real time new products. This approach was used as I was unable to provide correct
      // format of arguments to the grpc go server for creating or editing products, orders or categories
      const products = []
      for await (const chunk of productsStream) {
        products.push(chunk.product)
      }

      return products
    },
    /**
     *
     * @param {object} parent
     * @param {object} args contains the arguments passed to the getProucts query
     * @returns {Product[]} returns an array of all products that contain the productName from args
     */
    searchProducts: async (parent, args) => {
      const productsSearchStream = storeManagerService.searchProducts(args.productName)
      // This way of getting products is incorrect. Please refer to comments on method getProducts for reasoning
      const products = []
      for await (const chunk of productsSearchStream) {
        products.push(chunk.product)
      }

      return products
    },
    /**
     * @returns {Category[]} an array of all categories found
     */
    getCategories: async () => {
      const categoriesStream = storeManagerService.getCategories()
      const categories = []
      // This way of getting categories is incorrect. Please refer to comments on method getProducts for reasoning
      for await (const chunk of categoriesStream) {
        categories.push(chunk)
      }
      return categories
    },
    /**
     * @returns {Order[]} an array of all orders
     */
    getOrders: async () => {
      const ordersStream = storeManagerService.getOrders()
      const orders = []
      // This way of getting orders is incorrect. Please refer to comments on method getProducts for reasoning
      for await (const chunk of ordersStream) {
        orders.push(chunk)
      }
      return orders
    }
  }
}

module.exports = { resolvers }
