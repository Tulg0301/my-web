const { Error } = require("mongoose")
const uploadProductPermission = require("../../helper/premission")
const productModel = require("../../models/productModel")


async function UploadProductController(req,res){
    try {
        const sessionUserId = req.userId

        if(!uploadProductPermission(sessionUserId)){
            throw new Error("Bạn không có quyền thêm ")
        }

        const UploadProduct = new productModel(req.body)
        const saveProduct = await UploadProduct.save()

        res.status(201).json({
            message : " Thêm sản phẩm thành công",
            success : true,
            error : false,
            data:   saveProduct
        })
    } catch (error) {
         
        res.status(400).json({
            message: error.message || error,
            sucess : false,
            error : true
        })
    }
}

module.exports = UploadProductController