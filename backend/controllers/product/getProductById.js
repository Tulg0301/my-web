const productModel = require("../../models/productModel")

const getProducById = async(req,res)=> {
    try {
        const productId = req.body.productId
        const InforProduct = await productModel.findById(productId)
         res.json({
            data : InforProduct,
            success : true,
            error : false,
            message : "ok"
         })
    } catch (error) {
        res.json({
            message : error.message || error,
            success : false,
            error : false
        })
    }
}
module.exports = getProducById