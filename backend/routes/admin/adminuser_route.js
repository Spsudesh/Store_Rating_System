const express = require("express");

const { authMiddleware } = require("../../middleware/auth_middleware");

const authorizeRole = require("../../middleware/role_middleware");

const { addUser, getUsers } = require("../../controllers/admin/adminuser_controller");


const router = express.Router();


// add user
router.post("/admin/users", authMiddleware, authorizeRole("ADMIN"), addUser);


// Get users
router.get("/admin/users", authMiddleware, authorizeRole("ADMIN"), getUsers);


module.exports = router;
