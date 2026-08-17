const db = require("../../dbconnection");


// Get owner dashboard data
const getOwnerDashboard = async (req, res) => {

    try {

        const ownerId = req.user.id;

        // Find the store of this owner

        const [stores] = await db.promise().query(
            `  SELECT id  FROM stores WHERE owner_id = ? `, [ownerId] );


        // Owner does not have a store
        if (stores.length === 0) {

            return res.status(200).json({
                averageRating: 0,
                totalRatings: 0

            });

        }


        const storeId = stores[0].id;


        // Get rating info
        const [ratingData] = await db.promise().query( ` SELECT COUNT(*) AS totalRatings, COALESCE(AVG(rating), 0) AS averageRating FROM ratings WHERE store_id = ? `, [storeId]);


        return res.status(200).json({
            averageRating: Number(
                ratingData[0].averageRating
            ),

            totalRatings: Number(
                ratingData[0].totalRatings
            )

        });

    }

    catch (error) {

        console.error(
            "Owner dashboard error:",
            error
        );


        return res.status(500).json({
            message: "Failed to load owner dashboard"

        });

    }

};


module.exports = {getOwnerDashboard };