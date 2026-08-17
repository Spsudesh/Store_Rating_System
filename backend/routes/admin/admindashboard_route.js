const express = require("express");

const { authMiddleware } = require("../../middleware/auth_middleware");
const authorizeRole = require("../../middleware/role_middleware");

const { getAdminDashboard } = require("../../controllers/admin/admindashboardcontroller");

const router = express.Router();

router.get( "/admin/dashboard", authMiddleware, authorizeRole("ADMIN"), getAdminDashboard );

module.exports = router;
