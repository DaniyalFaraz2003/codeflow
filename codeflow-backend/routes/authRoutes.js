const express = require("express");
const {
    register,
    login,
    logout,
    getUser
} = require("../controllers/authController");
const {
    verifyToken
} = require("../middleware/auth");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/me", verifyToken, getUser);


module.exports = router;