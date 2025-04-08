const userModel = require("../../models/userModel");

async function userDetailController(req,res) {
    try {
        const userId = req.userId
        const user = await userModel.findById(userId).select("-password")

        res.json({
            message : "Thông tin người dùng",
            success : true,
            error: false,
            data : user
        })
    } catch (error) {
        res.status(400).json({
            message: error.message || error,
            error : true,
            success : false

        })
    }
    
}

module.exports = userDetailController