const userModel = require("../../models/userModel")
const bcrypt = require('bcryptjs');

async function useSignUpController(req, res) {

    try {

        const {email, password, name} = req.body

        const user = await userModel.findOne({email})

        if(user){
            throw new Error("Email không được trùng lặp ")
        }
        if(!email){
            throw new Error("Hãy cung cấp email")
        }
        if(!password){
            throw new Error("Hãy cung cấp mật khẩu")
        }
        if(!name){
            throw new Error("Hãy cung cấp tên")
        }

        const salt = bcrypt.genSaltSync(10);
        const hashPassword =await bcrypt.hashSync(password, salt);

        if(!hashPassword){
            throw new Error("something is wrong")
        }

        const payload = {
            ...req.body,
            role : "GENERAL",
            password : hashPassword
        }
        const userData = new userModel(payload)
        const saveUser = await userData.save()
        res.status(201).json({
            data : saveUser,
            success : true,
            error : false,
            message : "Đăng ký thành công"
        })
        
    } catch (err) {
        res.json({
            message: err.message || err,
            error : true,
            success : false

        })
        
    }
    
}

module.exports = useSignUpController