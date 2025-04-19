const OrderModel = require('../../models/orderModel');
const OrderDetailModel = require('../../models/orderDetail');

async function getAllOrdersController(req, res) {
  try {
    const orders = await OrderModel.find().sort({ createdAt: -1 }).populate('userId')

    if (!orders || orders.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy đơn hàng nào.'
      });
    }

    const ordersWithDetails = await Promise.all(
      orders.map(async (order) => {
        const details = await OrderDetailModel.find({ orderId: order._id }).populate('productId'); // populate nếu cần
        return {
          ...order._doc,
          items: details,
          userName: order.userId?.name,
          email: order.userId?.email
        };
      })
    );

    res.status(200).json({
      success: true,
      message: 'Lấy tất cả đơn hàng thành công',
      data: ordersWithDetails
    });
    
  } catch (error) {
    console.error('Lỗi khi lấy đơn hàng:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi máy chủ khi lấy đơn hàng.',
      error: true
    });
  }
}

module.exports = getAllOrdersController;
