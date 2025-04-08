const productModel = require("../../models/productModel")

const searchProduct = async (req, res) => {
  try {
    const query = req.body.query
    const regex = new RegExp(query, 'gi') // <-- sửa chỗ này

    const product = await productModel.find({
      "$or": [
        { productName: regex },
        { category: regex }
      ]
    })

    res.json({
      data: product,
      message: "list product",
      success: true,
      error: false
    })
  } catch (error) {
    res.json({
      success: false,
      error: true,
      message: error.message || error
    })
  }
}

module.exports = searchProduct
