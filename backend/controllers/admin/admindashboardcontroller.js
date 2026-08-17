const db = require("../../dbconnection");


const getAdminDashboard = async (req, res) => {

    try {

        // Total users
        const [totalUsersResult] = await db.promise().query( `SELECT COUNT(*) AS totalUsers FROM users `);


        // Total store owners
        const [storeOwnersResult] = await db.promise().query(`SELECT COUNT(*) AS totalStoreOwners FROM users WHERE role = 'STORE_OWNER' `);


        // Total normal users
        const [normalUsersResult] = await db.promise().query(` SELECT COUNT(*) AS totalNormalUsers FROM users WHERE role = 'USER' `);


        // Total stores
        const [storesResult] = await db.promise().query( ` SELECT COUNT(*) AS totalStores FROM stores `);


        // Total ratings
        const [ratingsResult] = await db.promise().query( `SELECT COUNT(*) AS totalRatings FROM ratings `);


        return res.status(200).json({

            totalUsers: totalUsersResult[0].totalUsers,

            totalStoreOwners:
                storeOwnersResult[0].totalStoreOwners,

            totalNormalUsers:
                normalUsersResult[0].totalNormalUsers,

            totalStores:
                storesResult[0].totalStores,

            totalRatings:
                ratingsResult[0].totalRatings

        });

    } catch (error) {

        console.error("Admin dashboard error:", error );

        return res.status(500).json({
            message: "Failed to load admin dashboard"
        });
    }
};


module.exports = { getAdminDashboard };