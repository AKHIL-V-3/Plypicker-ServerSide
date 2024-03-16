const express = require("express")
const userController = require("../../Controllers/authController")
const verifyToken  = require("../../Middleware/jsonwebtoken")


const router = express.Router()
const controller = userController()


router.post("/signup",controller.signupWithEmail)
router.post("/signin",controller.signInWithEmail)
router.get("/verifycheck",verifyToken,controller.userVerified)
router.get("/refreshtoken",controller.refreshUser)
router.get("/logout",controller.logout)


module.exports = router

