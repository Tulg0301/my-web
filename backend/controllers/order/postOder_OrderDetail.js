const OrderModel = require('../../models/orderModel');
const OrderDetailModel = require('../../models/orderDetail');

async function createOrderController(req, res) {
  try {
    const sessionUserId = req.userId;

    const {
      paymentMethod,
      receiverName,
      receiverPhone,
      shippingAddress,
      items 
    } = req.body;

    if (!items || items.length === 0) {
      throw new Error('Không có sản phẩm nào trong đơn hàng');
    }

    let totalPrice = 0;
    items.forEach(item => {
      if (!item.productId.sellingPrice || !item.quantity) throw new Error('Thiếu thông tin sản phẩm');
      totalPrice += item.productId.sellingPrice * item.quantity;
    });

    // Tạo đơn hàng chính
    const newOrder = await OrderModel.create({
      userId: sessionUserId,
      paymentMethod,
      receiverName,
      receiverPhone,
      shippingAddress,
      totalPrice
    });

    // Tạo chi tiết đơn hàng
    const orderDetails = items.map(item => ({
      productId: item.productId._id,
      productName: item.productId.productName,
      orderId: newOrder._id,
      price: item.productId.sellingPrice,
      quantity: item.quantity,
      total: item.productId.sellingPrice * item.quantity
    }));

    await OrderDetailModel.insertMany(orderDetails);

    res.json({
      success: true,
      message: 'Tạo đơn hàng thành công',
      data: {
        orderId: newOrder._id,
        totalPrice
      }
    });

  } catch (error) {
    res.status(400).json({
      message: error.message || 'Đã xảy ra lỗi',
      success: false,
      error: true
    });
  }
}

module.exports = createOrderController;
