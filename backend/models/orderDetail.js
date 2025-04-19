const mongoose = require('mongoose');

const orderDetailSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'product',
    required: true
  },
  productName: String,
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'order',
    required: true
  },
  price: Number,
  quantity: Number,
  total: Number
});

const OrderDetail = mongoose.model('orderdetail', orderDetailSchema);
module.exports = OrderDetail;
