const OrderService = require("../services/OrderService");
const Order = require("../models/OrderProduct");
const { response } = require("express");

const CreateOrder = async (req, res) => {
  try {
    console.log('req', req.body)
    const {
      paymentMethod,
      totalPrice,
      fullName,
      address,
      phone,
      
    } = req.body;
    if (
      !paymentMethod ||
      !totalPrice ||
      !fullName ||
      !address ||
      !phone 
    
    ) {
      return res.status(400).json({
        status: "ERR",
        message: "Missing required fields",
      });
    }

    const response = await OrderService.CreateOrder(req.body);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(500).json({
      message: "An error occurred while creating the order",
      error: e,
    });
  }
};



const GetOrdersByUserId = async (req, res) => {
    try {
      const userId = req.params.userId;
      const orders = await Order.find({ user: userId });
  
      if (!orders || orders.length === 0) {
        return res.status(404).json({
          status: 'ERR',
          message: 'Không tìm thấy đơn hàng cho người dùng này',
        });
      }
  
      return res.status(200).json({
        status: 'OK',
        message: 'Đã tìm thấy đơn hàng',
        data: orders,
      });
    } catch (error) {
      return res.status(500).json({
        status: 'ERR',
        message: 'Đã xảy ra lỗi khi lấy thông tin đơn hàng',
        error: error.message,
      });
    }
  };
  
const getAllOrder = async (req, res) => {
    try {
        const data = await OrderService.getAllOrder()
        return res.status(200).json(data)
    } catch (e) {
        return res.status(404).json({
            message: 'e',
          });
    }
}
const updateOrder = async (req, res) => {
  try {
    const userId = req.params.userId; // Lấy userId từ params
    const orderId = req.params.orderId; // Lấy orderId từ params nếu cần
    const updatedOrder = req.body; // Dữ liệu cập nhật từ request body

    let response;
    if (orderId) {
      // Cập nhật đơn hàng cụ thể
      response = await OrderService.updateOrder(userId, orderId, updatedOrder);
    } else {
      // Cập nhật tất cả đơn hàng của người dùng
      response = await OrderService.updateOrder(userId, updatedOrder);
    }

    return res.status(200).json(response);
  } catch (e) {
    return res.status(500).json({
      status: 'ERR',
      message: 'An error occurred while updating the order(s)',
      error: e.message,
    });
  }
};
const deleteOrder = async (req, res) => {
  try {
    // Xử lý yêu cầu xóa đơn hàng
    const userId = req.params.userId;
    const orderId = req.params.orderId;
    const response = await OrderService.deleteOrder(userId, orderId);
    
    return res.status(200).json(response);
  } catch (e) {
    return res.status(500).json({
      status: 'ERR',
      message: 'An error occurred while deleting the order',
      error: e.message,
    });
  }
};

module.exports = {
  CreateOrder,
  GetOrdersByUserId,
  getAllOrder,
  updateOrder,
  deleteOrder
};
