const express = require("express");

const router = express.Router();


const { authMiddleware } = require("../middleware/auth_middleware");


const { updatePassword } = require(  "../controllers/update_password_controller" );



router.put( "/update-password", authMiddleware, updatePassword );


module.exports = router;
