const express = require('express')

const router = express.Router()

const useSignUpController = require('../controllers/user/userSignUp')
const userSigninController = require('../controllers/user/userSignIn')
const authToken = require('../middleware/authToken')
const userDetailController = require('../controllers/user/userDetail')
const userLogout = require('../controllers/user/userLogout')
const allUsers = require('../controllers/user/allUsers')
const updateUser = require('../controllers/user/updateUserRole')
const UploadProductController = require('../controllers/product/uploadProduct')
const getProductController = require('../controllers/product/getProduct')
const updateProductController = require('../controllers/product/updateProduct')
const deleteProductController = require('../controllers/product/deleteProduct')
const getCategoryProductOne = require('../controllers/product/getCategoryProductOne')
const getCategoryWiseProduct = require('../controllers/product/getCategoryWiseProduct')
const getProductDetails = require('../controllers/product/getPoductDetail')
const addToCartController = require('../controllers/user/addToCartController')
const countAddToCart = require('../controllers/user/countAddToCart')
const addToCartViewItem = require('../controllers/user/addToCartViewItem')
const getProducById = require('../controllers/product/getProductById')
const updateAddToCartProduct = require('../controllers/user/updateAddToCartProduct')
const delAddToCart = require('../controllers/user/delAddToCart')
const searchProduct = require('../controllers/product/searchProduct')

router.post("/signup",useSignUpController)
router.post("/signin",userSigninController)
router.get("/user-details",authToken,userDetailController)
router.get("/userLogout",userLogout)

// admin panel
router.get("/all-user",authToken,allUsers)

//update user
router.post("/update-user",authToken,updateUser)

//upload Product
router.post("/upload-product",authToken,UploadProductController)

//Get product
router.get("/get-product",getProductController)

//update product
router.post("/update-product",authToken,updateProductController)

// Định nghĩa route DELETE /api/products/:id
router.delete('/product/:id',authToken,deleteProductController);
//Get product one
router.get("/get-product-category",getCategoryProductOne)
//Get product one
router.post("/category-product",getCategoryWiseProduct)

//Get product detail
router.post("/product-details",getProductDetails)

// add to cart 

router.post("/addtocart",authToken,addToCartController)

router.get("/countaddtocart",authToken,countAddToCart)

router.get("/view-cart-product",authToken,addToCartViewItem)

router.post("/getproductbyid",authToken,getProducById)

router.post("/update-cart-product",authToken,updateAddToCartProduct)

router.post("/delete-cart-product",authToken,delAddToCart)

router.post("/search",searchProduct)

module.exports = router