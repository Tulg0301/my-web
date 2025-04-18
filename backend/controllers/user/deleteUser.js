const uploadProductPermission = require("../../helper/premission")
const userModel = require("../../models/userModel")
async function deleteUserController(req, res) {

    try {
        const sessionUserId = req.userId
        if(!uploadProductPermission(sessionUserId)){
            throw new Error("Bạn không có quyền xóa")
        }
        const{id}= req.params
        const deletedUser = await userModel.findByIdAndDelete(id);

        if (!deletedUser) {
            return res.status(404).json({ success: false, message: "Người dùng không tồn tại" });
        }

        res.json({ success: true, message: "Xóa người dùng thành công", data: deletedUser });
        
        
    } catch (error) {

        res.status(400).json({
            message: error.message || error,
            success : false,
            error : true
        })
    }

    
}
module.exports = deleteUserController