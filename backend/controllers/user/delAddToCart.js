const addToCartModel = require("../../models/cartProduct");

const delAddToCart = async (req, res) => {
    try {
        const currentUserId = req.userId; // Đảm bảo rằng req.userId chứa ID của người dùng hiện tại
        const addToCartProductId = req.body.id; // Đồng nhất với tên trường từ frontend

        if (!addToCartProductId) {
            return res.status(400).json({
                success: false,
                error: true,
                message: "Thiếu thông tin id của sản phẩm cần xóa"
            });
        }

        // Xóa sản phẩm dựa trên userId và _id để đảm bảo tính bảo mật
        const delProduct = await addToCartModel.findOneAndDelete({
            _id: addToCartProductId,
            userId: currentUserId
        });

        if (!delProduct) {
            return res.status(404).json({
                success: false,
                error: true,
                message: "Không tìm thấy sản phẩm hoặc bạn không có quyền xóa"
            });
        }

        res.json({
            success: true,
            error: false,
            message: "Xóa sản phẩm thành công",
            data: delProduct
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: true,
            message: error.message || "Đã xảy ra lỗi trong quá trình xử lý"
        });
    }
};

module.exports = delAddToCart;
