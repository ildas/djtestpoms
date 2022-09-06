require('dotenv').config()
const grpc = require('@grpc/grpc-js');
const { djtestpoms_proto } = require('./gprc-client')  
const protobuf = require('protobufjs')


const grpsClient = new djtestpoms_proto.StoreManager('localhost:8080',
    grpc.credentials.createInsecure());

class StoreManagerService {

    _handleError(err) {
        console.error({methodName: this.name, err})
        throw err
    }

    /**
     * TODO clean comments
     * @param {string[]} ids 
     * @returns {Stream[Product]} returns a stream of Products
     */
    getProducts(ids) {
        const productsStream = grpsClient.GetProducts({ 
            apiKey: process.env.API_KEY, ids
        })
        productsStream.on('error', this._handleError.bind({name: 'getProducts'}))
        return productsStream
        // let products = []
        // for await (const chunk of productsStream) {
        //     products.push(chunk.product)
        // }
        // return productsStream
    }

    //TODO remove comments
    /**
     * @returns {Stream[Category]} a stream of Categories like this { id: '7', name: 'CategoryName' }
     */
    getCategories(){
        const categoriesStream = grpsClient.GetCategories({
            apiKey: process.env.API_KEY
        })
        categoriesStream.on('error', this._handleError.bind({name: 'getCategories'}))
        return categoriesStream
        // let categories = []
        // console.log({categoriesStream})
        // for await (const chunk of categoriesStream) {
        //     categories.push(chunk.name)
        // }
        // return categories
    }

    /**
     * 
     * @param {string} productName such as Swimwear
     * @returns {Stream[Product]} returns a stream of Products
     */
    searchProducts(productName){
        const searchProductsStream = grpsClient.SearchProducts({
            apiKey: process.env.API_KEY, name: productName
        })
        searchProductsStream.on('error', this._handleError.bind({name: 'searchProducts'}))
        return searchProductsStream
    }

    //TODO remove comments
    /**
     * @returns {Stream[Category]} a stream of Categories like this { id: '7', name: 'CategoryName' }
     */
     getOrders(){
        const ordersStream =  grpsClient.GetOrders({apiKey: process.env.API_KEY})

        ordersStream.on('error', this._handleError.bind({name: 'getOrders'}))
        return ordersStream
    }   

    // not working well, incorrect arguments error
    createOrder(){
        const m = new Map()
        m.set( '17', '2')
        
        const argsObj = {
            apiKey: process.env.API_KEY,
            items:  [[17], [2]]
            // items: {name: 17, value: 2}
        }

        const createOrderStream = grpsClient.CreateOrder(argsObj)
        
        return createOrderStream
    }

    // not working well, incorrect arguments error
    changeOrderStatus(){

        const argsObj = { 
            apiKey: 'dQw4w9WgXcQ',
            order_id:  11,
            status: 'CANCELLED',
        }
        const order =  grpsClient.ChangeOrderStatus(argsObj)
        return order
    }

    // not working well, incorrect arguments error
    editProduct() {

        const argsObj = {
            apiKey: 'dQw4w9WgXcQ',
            Product: {
                id: 14, name: "Swimwear", color: "Red", price: 53.71, categoryId: 7
            },
        }
        data = grpsClient.EditProduct({argsObj})
        return data
    }
}

module.exports = {StoreManagerService}
