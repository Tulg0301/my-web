const productModel = require("../../models/productModel")

const getCategoryProductOne = async(req, res) =>{

    try {
        const productCategory = await productModel.distinct("category")

        console.log("category",productCategory )

        const productByCategory = []

        for(const category of productCategory){
            const product = await productModel.findOne({category : category})

            if(product){
                productByCategory.push(product)
            }
        }
        res.json({
            message : "Danh mục sản phẩm",
            success : true,
            error : false,
            data :productByCategory
        })

        
    } catch (error) {
        res.status(400).json({
            message: error.message || error,
            sucess : false,
            error : true
        })
    }
}
module.exports = getCategoryProductOne