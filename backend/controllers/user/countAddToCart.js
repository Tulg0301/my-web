const addToCartModel = require("../../models/cartProduct")

const countAddToCart = async(req,res) =>{
    try {
        const userId = req.userId

        const count = await addToCartModel.countDocuments({
            userId : userId
        })

        res.json({
            data : {
                count: count
            },
            message : "Ok",
            error : false,
            success : true,
        })
    } catch (error) {
        res.json({
            message : error.message || error,
            error : false,
            success : true
        })
    }
}
module.exports = countAddToCart