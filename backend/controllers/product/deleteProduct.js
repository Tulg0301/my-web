const uploadProductPermission = require("../../helper/premission")
const productModel = require("../../models/productModel")
async function deleteProductController(req, res) {

    try {
        const sessionUserId = req.userId
        if(!uploadProductPermission(sessionUserId)){
            throw new Error("Bạn không có quyền xóa ")
        }
        const{id}= req.params
        const deletedProduct = await productModel.findByIdAndDelete(id);

        if (!deletedProduct) {
            return res.status(404).json({ success: false, message: "Sản phẩm không tồn tại" });
        }

        res.json({ success: true, message: "Xóa sản phẩm thành công", data: deletedProduct });
        
        
    } catch (error) {

        res.status(400).json({
            message: error.message || error,
            success : false,
            error : true
        })
    }

    
}
module.exports = deleteProductController