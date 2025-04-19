const OrderModel = require('../../models/orderModel');
const OrderDetailModel = require('../../models/orderDetail');

async function getOrdersByUserIdController(req, res) {
  try {
    const sessionUserId = req.userId;

    // Lấy danh sách đơn hàng của người dùng, sắp xếp theo thời gian mới nhất
    const orders = await OrderModel.find({ userId: sessionUserId }).sort({ createdAt: -1 });

    if (!orders || orders.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy đơn hàng nào cho người dùng này.'
      });
    }

    const ordersWithDetails = await Promise.all(
      orders.map(async (order) => {
        const details = await OrderDetailModel.find({ orderId: order._id });
        return {
          ...order._doc,
          items: details
        };
      })
    );

    res.status(200).json({
      success: true,
      message: 'Lấy đơn hàng thành công',
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

module.exports = getOrdersByUserIdController;
