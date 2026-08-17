const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const signupRoute = require('./routes/signup_route');
const loginRoute = require('./routes/login_route');
const currentuserroute =  require("./routes/current_user_route");

const updatePasswordRoute = require( "./routes/update_password_route" );

//admin panel routes
const adminDashboardRoute = require("./routes/admin/admindashboard_route");
const adminUserRoute = require("./routes/admin/adminuser_route");
const adminStoreRoute = require("./routes/admin/adminstore_route");
const adminRatingRoute = require("./routes/admin/adminrating_route");


//owner panel
const ownerDashboardRoute = require( "./routes/owner/ownerdashboard_route" );
const ownerRatingRoute = require( "./routes/owner/ownerrating_route" );

//user panel
const userStoreRoute = require(  "./routes/user/user_store_route" );

const userRatingRoute = require( "./routes/user/user_rating_route" );


const dbConnection = require('./dbconnection');

const app = express();

const Port = process.env.PORT || 3000;


app.use(cors());
app.use(express.json());

//fro update password
app.use("/users",updatePasswordRoute );

app.use("/", signupRoute );
app.use("/", loginRoute );
app.use("/", currentuserroute);

app.use("/", adminDashboardRoute);
app.use("/", adminUserRoute);
app.use("/", adminStoreRoute);
app.use("/", adminRatingRoute);


//owner
app.use( "/owner", ownerDashboardRoute );
app.use("/owner",ownerRatingRoute );


//user
app.use( "/user", userStoreRoute );


app.use( "/user", userRatingRoute );

app.listen(Port, () => {
    console.log(`Server is running on port ${Port}`);
});
