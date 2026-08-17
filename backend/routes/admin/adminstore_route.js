const express = require("express");

const { authMiddleware } = require("../../middleware/auth_middleware");

const authorizeRole = require("../../middleware/role_middleware");

const { addStore, getStores } = require("../../controllers/admin/adminstore_controller");


const router = express.Router();


// Add store
router.post("/admin/stores", authMiddleware, authorizeRole("ADMIN"), addStore);


// Get stores
router.get("/admin/stores", authMiddleware, authorizeRole("ADMIN"), getStores);


module.exports = router;
