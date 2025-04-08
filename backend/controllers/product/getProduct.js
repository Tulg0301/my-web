const productModel = require("../../models/productModel")

const getProductController = async (req, res) =>{
    try {

        const allProduct = await  productModel.find().sort({ cretedAt : -1})

        res.json({
            message : "Tất cả sản phẩm",
            success : true,
            errorr: false,
            data : allProduct
        })
        
    } catch (error) {
        res.status(400).json({
            message: error.message || error,
            sucess : false,
            error : true
        })
    }

}
module.exports = getProductController