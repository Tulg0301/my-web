const productModel = require("../../models/productModel")

const getCategoryWiseProduct = async(req,res)=>{
    try {
        const {category} = req?.body || req?.query
        const product = await productModel.find({category})
         res.json({
            data : product,
            success : true,
            error : false,
            message : "product"
         })
    } catch (error) {
        res.status(400).json({
            message: error.message || error,
            sucess : false,
            error : true
        })
    }
    
}
module.exports = getCategoryWiseProduct