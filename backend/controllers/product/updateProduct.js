const uploadProductPermission = require("../../helper/premission")
const productModel = require("../../models/productModel")

async function updateProductController(req, res){
    try {
        const sessionUserId = req.userId
        
        if(!uploadProductPermission(sessionUserId)){
            throw new Error("Bạn không có quyền thêm ")
        }
        const {_id,...resBody} = req.body

        const updatedProduct = await productModel.findByIdAndUpdate(
            _id,
            resBody,
            { new: true, runValidators: true } // Trả về dữ liệu sau khi cập nhật
        );

        if (!updatedProduct) {
            throw new Error("Không tìm thấy sản phẩm!");
        }

        res.json({
            message: "Cập nhật sản phẩm thành công!",
            success: true,
            product: updatedProduct,
        });



        
    } catch (error) {
        res.status(400).json({
            message: error.message || error,
            sucess : false,
            error : true
        })
    }
}

module.exports = updateProductController