const express = require("express");

const {authMiddleware} = require("../middleware/auth_middleware");
const { getCurrentUser } = require("../controllers/current_user_controller");

const router = express.Router();

router.get("/users/me" , authMiddleware , getCurrentUser );

module.exports = router;
