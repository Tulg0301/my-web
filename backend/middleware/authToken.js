const jwt = require("jsonwebtoken");

async function authToken(req, res, next) {
    try {
        const token = req.cookies?.token;

        if (!token) {
            return res.json({
                message: "Người dùng chưa đăng nhập",
                error: true,
                success: false
            });
        }

        jwt.verify(token, process.env.TOKEN_SECRET_KEY, (err, decoded) => {
            if (err) {
                console.error("Lỗi xác thực token:", err);
                return res.status(401).json({
                    message: "Token không hợp lệ hoặc đã hết hạn",
                    error: true,
                    success: false
                });
            }

           
            req.userId = decoded._id;
            next(); // Chuyển sang middleware tiếp theo
        });

    } catch (error) {
        res.status(400).json({
            message: error.message || error,
            data: [],
            error: true,
            success: false
        });
    }
}

module.exports = authToken;
