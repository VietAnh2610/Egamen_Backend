const express = require('express')
const router = express.Router()
const OrderController = require('../controllers/OrderController')
const { authUserMiddleware, authMiddleware } = require('../middleware/authMiddleware')



router.post('/create', OrderController.CreateOrder)
router.get('/user/:userId', OrderController.GetOrdersByUserId);
router.get('/getAllOrder', authMiddleware, OrderController.getAllOrder);
router.put('/update/:userId/:orderId', authMiddleware, OrderController.updateOrder)
router.delete('/delete/:userId/:orderId', authMiddleware, OrderController.deleteOrder)


module.exports = router