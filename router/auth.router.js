const express = require("express")
const { registerAccount, loginAccount, logout } = require("../controller/auth.controller")
const { verifyToken } = require("../middleware/verifyToken")
const { createUser, signInUser, getAllUser } = require("../controller/userController")
const router = express.Router()


router.post("/register", registerAccount)
router.post("/login", loginAccount)
router.get("/logout", logout)
router.post("/create-user", createUser)
router.post("/signin-user", signInUser)
router.get("/getAllUser",getAllUser)
router.get("/me", verifyToken, (req,res)=>{
    res.status(200).json({
        success:true,
        user:{id:req.user.id}
    })
})

module.exports = router