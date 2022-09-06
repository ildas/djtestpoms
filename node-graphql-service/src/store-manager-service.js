require('dotenv').config()
const grpc = require('@grpc/grpc-js')
const { djtestpomsProtoLoaded } = require('./gprc-client')

const grpsClient = new djtestpomsProtoLoaded.StoreManager('localhost:8080',
  grpc.credentials.createInsecure())

class StoreManagerService {
  _handleError (err) {
    console.error({ methodName: this.name, err })
    throw err
  }

  /**
     * @param {string[]} ids
     * @returns {Stream[Product]} returns a stream of Products
     */
  getProducts (ids) {
    const productsStream = grpsClient.GetProducts({
      apiKey: process.env.API_KEY, ids
    })
    productsStream.on('error', this._handleError.bind({ name: 'getProducts' }))
    return productsStream
  }

  /**
     * @returns {Stream[Category]} a stream of Categories like this { id: '7', name: 'CategoryName' }
     */
  getCategories () {
    const categoriesStream = grpsClient.GetCategories({
      apiKey: process.env.API_KEY
    })
    categoriesStream.on('error', this._handleError.bind({ name: 'getCategories' }))
    return categoriesStream
  }

  /**
     *
     * @param {string} productName such as Swimwear
     * @returns {Stream[Product]} returns a stream of Products
     */
  searchProducts (productName) {
    const searchProductsStream = grpsClient.SearchProducts({
      apiKey: process.env.API_KEY, name: productName
    })
    searchProductsStream.on('error', this._handleError.bind({ name: 'searchProducts' }))
    return searchProductsStream
  }

  /**
     * @returns {Stream[Category]} a stream of Categories like this { id: '7', name: 'CategoryName' }
     */
  getOrders () {
    const ordersStream = grpsClient.GetOrders({ apiKey: process.env.API_KEY })

    ordersStream.on('error', this._handleError.bind({ name: 'getOrders' }))
    return ordersStream
  }

  // not working well, incorrect arguments error
  createOrder () {
    const m = new Map()
    m.set('17', '2')

    const argsObj = {
      apiKey: process.env.API_KEY,
      items: [[17], [2]]
    }

    const createOrderStream = grpsClient.CreateOrder(argsObj)

    return createOrderStream
  }

  // not working well, incorrect arguments error
  changeOrderStatus () {
    const argsObj = {
      apiKey: process.env.API_KEY,
      order_id: 11,
      status: 'CANCELLED'
    }
    const order = grpsClient.ChangeOrderStatus(argsObj)
    return order
  }

  // not working well, incorrect arguments error
  editProduct () {
    const argsObj = {
      apiKey: process.env.API_KEY,
      Product: {
        id: 14, name: 'Swimwear', color: 'Red', price: 43.71, categoryId: 7
      }
    }
    const product = grpsClient.EditProduct({ argsObj })
    return product
  }
}

module.exports = { StoreManagerService }
