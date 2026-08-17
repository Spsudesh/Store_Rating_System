const express = require("express");

const router = express.Router();



const { authMiddleware } = require("../../middleware/auth_middleware");

const authorizeRole = require("../../middleware/role_middleware");



const { getUserStores } = require( "../../controllers/user/user_store_controller" );



// Get stores

router.get( "/stores", authMiddleware, authorizeRole("USER"), getUserStores );


module.exports = router;
