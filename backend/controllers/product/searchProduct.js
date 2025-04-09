const productModel = require("../../models/productModel");

const searchProduct = async (req, res) => {
  try {
    const { query, arrCategory, sortOrder } = req.body;
    let sortCondition = {};
    if (sortOrder === "asc") {
      sortCondition = { sellingPrice: 1 };
    } else if (sortOrder === "desc") {
      sortCondition = { sellingPrice: -1 };
    }
    const conditions = [];
    if (arrCategory && arrCategory.length > 0) {
      const categoryRegexConditions = arrCategory.map(cat => ({
        category: { $regex: new RegExp(cat, 'i') }
      }));
      conditions.push({ $or: categoryRegexConditions });
    } else if (query) {
      const regex = new RegExp(query, 'gi');
      conditions.push({
        $or: [
          { productName: regex },
          { category: regex }
        ]
      });
    }

    const finalQuery = conditions.length > 0 ? { $and: conditions } : {};
    const product = await productModel.find(finalQuery).sort(sortCondition);

    res.json({
      data: product,
      message: "list product",
      success: true,
      error: false
    });
  } catch (error) {
    res.json({
      success: false,
      error: true,
      message: error.message || error
    });
  }
};

module.exports = searchProduct;
