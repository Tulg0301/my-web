const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userModel = require("../../models/userModel");

async function userSigninController(req, res) {
    try {
        const { email, password } = req.body;

        // Kiểm tra dữ liệu đầu vào
        if (!email) {
            return res.status(400).json({ message: "Hãy nhập email", error: true });
        }
        if (!password) {
            return res.status(400).json({ message: "Nhập mật khẩu", error: true });
        }

        // Kiểm tra tài khoản có tồn tại không
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "Tài khoản này không tồn tại", error: true });
        }

        // Kiểm tra mật khẩu
        const checkPassword = await bcrypt.compare(password, user.password);
        if (!checkPassword) {
            return res.status(401).json({ message: "Sai mật khẩu", error: true });
        }

        // Tạo token
        const tokenData = { _id: user._id, email: user.email };
        try {
            const token = jwt.sign(tokenData, process.env.TOKEN_SECRET_KEY, { expiresIn: "8h" });

            // Cấu hình cookie
            const tokenOption = {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production", // Chỉ bật secure nếu chạy trên môi trường production
                sameSite: "strict"
            };

            res.cookie("token", token, tokenOption).status(200).json({
                message: "Đăng nhập thành công", 
                data: token,
                success: true
            });

        } catch (err) {
            console.error("JWT Error:", err);
            res.status(500).json({ message: "Lỗi hệ thống khi tạo token", error: true });
        }
    } catch (err) {
        console.error("Login Error:", err);
        res.status(500).json({ message: err.message || "Lỗi hệ thống", error: true });
    }
}

module.exports = userSigninController;
