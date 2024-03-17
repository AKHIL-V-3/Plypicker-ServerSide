const express = require("express")
const userController = require("../Controllers/controller")
const verifyToken  = require("../Middleware/jsonwebtoken")


const router = express.Router()
const controller = userController()


router.post("/signup",controller.signupWithEmail)
router.post("/signin",controller.signInWithEmail)
router.get("/verifycheck",verifyToken,controller.userVerified)
router.get("/refreshtoken",controller.refreshUser)
router.get("/logout",controller.logout)
router.get("/getproduct",controller.getAllProducts)

router.get("/viewproduct/:id",controller.viewProduct)
router.post("/adduserreview",controller.addUserReview)
router.post("/editproduct",controller.editProduct)
router.post("/addproduct",controller.addproductfromapi)
router.get("/getreviewproducts",controller.getreviewproducts)
router.get("/getreviewproduct/:id",controller.getSingleReviewProduct)
router.get("/userrequests/:id",controller.getUserRequests)
router.post("/usereditproductreq",controller.userReqEdit)


module.exports = router

