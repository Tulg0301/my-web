const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true
  },
  totalPrice: Number,
  status: {
    type: String,
    enum: ['Đang xử lý', 'Đang chuẩn bị hàng', 'Đã gửi cho bên vận chuyển', 'Đang vận chuyển', 'Đã giao hàng', 'Đã hủy'],
    default: 'Đang xử lý'
  },
  paymentMethod: String,
  receiverName: String,
  receiverPhone: String,
  shippingAddress: String
}, {
  timestamps: true
});

const Order = mongoose.model('order', orderSchema);
module.exports = Order;
