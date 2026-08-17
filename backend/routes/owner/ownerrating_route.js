const express = require("express");

const router = express.Router();


const { authMiddleware } = require("../../middleware/auth_middleware");
const authorizeRole = require("../../middleware/role_middleware");


const { getOwnerRatings } = require( "../../controllers/owner/ownerrating_controller" );



router.get( "/ratings", authMiddleware,   authorizeRole("STORE_OWNER"), getOwnerRatings );



module.exports = router;
