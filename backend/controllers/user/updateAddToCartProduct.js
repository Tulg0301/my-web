const addToCartModel = require("../../models/cartProduct");

const updateAddToCartProduct = async (req, res) => {
    try {
        const currentUser = req.userId;
        const addToCartProductId = req.body.id;
        const qty = req.body.quantity;

        if (!addToCartProductId || qty == null) {
            return res.status(400).json({
                success: false,
                error: true,
                message: "Thiếu thông tin id hoặc quantity"
            });
        }

        const updateProduct = await addToCartModel.updateOne(
            { _id: addToCartProductId, userId: currentUser }, 
            { $set: { quantity: qty } } 
        );

        res.json({
            message: "Cập nhật số lượng thành công",
            data: updateProduct,
            error: false,
            success: true
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            error: true,
            message: error.message || "Đã xảy ra lỗi server"
        });
    }
};

module.exports = updateAddToCartProduct;
