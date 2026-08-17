const db = require("../dbconnection");

const bcrypt = require("bcrypt");


const updatePassword = async (req, res) => {

    try {

        const userId = req.user.id;

        const { currentPassword, newPassword } = req.body;


        // Check required fields
        if (!currentPassword || !newPassword) {

            return res.status(400).json({
                message: "Current password and new password are required"
            });

        }

        const passwordRegex = /^(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,16}$/;

        if (!passwordRegex.test(newPassword)) {
            return res.status(400).json({
                message: "New password must be 8-16 characters with at least one uppercase letter and one special character"
            });
        }

        // Get current password from database
        const [users] = await db.promise().query(  ` SELECT password FROM users WHERE id = ? `,  [userId] );



        // Check user exists
        if (users.length === 0) {
            return res.status(404).json({
                message: "User not found"
            });

        }


        const storedPassword =
            users[0].password;


        // Compare current password
        const passwordMatch = await bcrypt.compare( currentPassword, storedPassword );

        if (!passwordMatch) {
            return res.status(401).json({
               message:"Current password is incorrect"

            });

        }

        // Hash new password
        const hashedPassword = await bcrypt.hash( newPassword, 10 );

        // Update password
        await db.promise().query( ` UPDATE users SET password = ? WHERE id = ? `, [hashedPassword,userId] );

        return res.status(200).json({
          message: "Password updated successfully"

        });

    }


    catch (error) {

        console.error( "Update password error:",  error);

        return res.status(500).json({  message:  "Failed to update password" });

    }

};



module.exports = { updatePassword };
