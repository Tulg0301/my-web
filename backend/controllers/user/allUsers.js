const userModel = require("../../models/userModel")

async function allUsers(req, res) {

    try {

       const userId = req.userId
       const allUsers = await userModel.find()

       res.json({
            message : "all user",
            data : allUsers,
            success :true,
            error : false,

       })
        
    } catch (error) {
        res.status(400).json({
            message: err.message || err,
            error : true,
            success : false

        })
    }
    
}
module.exports = allUsers