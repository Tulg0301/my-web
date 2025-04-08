const AddToCartModel = require("../../models/cartProduct");

const addToCartController = async (req, res) => {
    try {
        const { productId } = req.body;
        const currentUser = req.userId;

        if (!productId) {
            return res.json({
                message: "Thiếu productId",
                success: false,
                error: true
            });
        }

        // Kiểm tra xem sản phẩm đã có trong giỏ hàng của người dùng chưa
        const isProductAvailable = await AddToCartModel.findOne({ productId, userId: currentUser });
        if (isProductAvailable) {
            return res.json({
                message: "Sản phẩm đã có trong giỏ hàng",
                success: false,
                error: true
            });
        }

        const payload = {
            productId,
            quantity: 1,
            userId: currentUser,
        };

        const newAddToCart = new AddToCartModel(payload);
        const saveProduct = await newAddToCart.save();

        res.json({
            message: "Đã thêm vào giỏ hàng",
            success: true,
            error: false,
            data: saveProduct
        });

    } catch (error) {
        res.json({
            message: error?.message || "Lỗi không xác định",
            success: false,
            error: true
        });
    }
};

module.exports = addToCartController;
