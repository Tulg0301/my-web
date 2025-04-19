const OrderModel = require('../../models/orderModel');

async function updateOrderStatusController(req, res) {
  try {
    const { newStatus, orderId } = req.body;

    if (!newStatus) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng cung cấp trạng thái mới.'
      });
    }

    const updatedOrder = await OrderModel.findByIdAndUpdate(
      orderId,
      { status: newStatus },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy đơn hàng để cập nhật.'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Cập nhật trạng thái đơn hàng thành công.',
      data: updatedOrder
    });

  } catch (error) {
    console.error('Lỗi khi cập nhật trạng thái đơn hàng:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi máy chủ khi cập nhật trạng thái đơn hàng.',
    });
  }
}

module.exports = updateOrderStatusController;
