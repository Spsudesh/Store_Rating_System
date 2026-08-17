const express = require("express");

const { authMiddleware } = require("../../middleware/auth_middleware");

const authorizeRole = require("../../middleware/role_middleware");

const { getRatings } = require("../../controllers/admin/adminrating_controller");


const router = express.Router();


router.get( "/admin/ratings", authMiddleware, authorizeRole("ADMIN"), getRatings );


module.exports = router;