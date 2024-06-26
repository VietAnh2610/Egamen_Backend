const Order = require("../models/OrderProduct");
const Product = require("../models/ProductModel");

const CreateOrder = (newOrder) => {
  return new Promise(async (resolve, reject) => {
    const { orderItems, paymentMethod, totalPrice, fullName, address, phone, user } = newOrder;
    try {

      const createOrder = await Order.create({
        orderItems,
        shippingAddress: {
          fullName,
          address,
          phone
        },
        paymentMethod,
        totalPrice,
        user: user
      });

      if (createOrder) {
        resolve({
          status: "OK",
          message: "SUCCESS",
          data: createOrder,
        });
      }
    } catch (e) {
      reject({
        status: "ERR",
        message: "Đã xảy ra lỗi đặt hàng",
        error: e.message,
      });
    }
  });
};

const getOrdersByUserId = async (userId) => {
  try {
    const orders = await Order.find({ user: userId });
    return orders;
  } catch (error) {
    console.error("Error retrieving orders by user ID:", error);
    throw error;
  }
};

const getAllOrder = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const allOrder = await Order.find();
      resolve({
        status: "OK",
        message: "List all order",
        data: allOrder,
      });
    } catch (e) {
      reject(e);
    }
  });
};

const updateOrder = (userId, orderId, updatedOrder) => {
  console.log(userId, orderId);
  return new Promise(async (resolve, reject) => {
    try {
      // Tìm đơn hàng cụ thể dựa trên userId và orderId và cập nhật thông tin
      const order = await Order.findOneAndUpdate(
        { user: userId, _id: orderId },  // Điều kiện tìm kiếm
        { $set: updatedOrder },  // Dữ liệu cập nhật
        { new: true }  // Trả về dữ liệu mới sau khi cập nhật
      );

      if (order) {
        resolve({
          status: "OK",
          message: "Order updated successfully",
          data: order,
        });
      } else {
        reject({
          status: "ERR",
          message: "Order not found",
        });
      }
    } catch (error) {
      reject({
        status: "ERR",
        message: "Error updating order",
        error: error.message,
      });
    }
  });
};
const deleteOrder = (userId, orderId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const order = await Order.findOneAndDelete({ user: userId, _id: orderId });

      if (order) {
        resolve({
          status: "OK",
          message: "Order deleted successfully",
          data: order,
        });
      } else {
        reject({
          status: "ERR",
          message: "Order not found",
        });
      }
    } catch (error) {
      reject({
        status: "ERR",
        message: "Error deleting order",
        error: error.message,
      });
    }
  });
};



module.exports = {
  CreateOrder,
  getOrdersByUserId,
  getAllOrder,
  updateOrder,
  deleteOrder
};
