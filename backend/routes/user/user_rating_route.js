const express = require("express");

const router = express.Router();



const { authMiddleware } = require("../../middleware/auth_middleware");

const authorizeRole = require("../../middleware/role_middleware");

const { submitRating, updateRating } = require( "../../controllers/user/user_rating_controller" );


// Submit new rating
router.post( "/ratings", authMiddleware,  authorizeRole("USER"),  submitRating );



// Update existing rating
router.put( "/ratings/:storeId", authMiddleware, authorizeRole("USER"), updateRating );


module.exports = router;
