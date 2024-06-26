const UserRouter = require('./UserRouter')
const ProductRouter = require('./productRouter')
const OrderRouter = require('./OrderRouter')
const PostRouter = require('./PostRouter')
const routes = (app) => {
    app.use('/api/user', UserRouter)
    app.use('/api/product', ProductRouter)
    app.use('/api/order', OrderRouter)
    app.use('/api/post', PostRouter)
}
module.exports = routes