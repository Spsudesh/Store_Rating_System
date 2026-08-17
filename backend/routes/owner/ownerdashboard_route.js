const express = require("express");

const router = express.Router();


const { authMiddleware } = require("../../middleware/auth_middleware");
const authorizeRole = require("../../middleware/role_middleware");


const { getOwnerDashboard } = require("../../controllers/owner/ownerdashboard_controller");


router.get( "/dashboard", authMiddleware, authorizeRole("STORE_OWNER"),  getOwnerDashboard );

module.exports = router;
