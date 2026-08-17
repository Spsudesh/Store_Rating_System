const db = require("../../dbconnection");


// Get ratings for owner's store
const getOwnerRatings = async (req, res) => {

    try {

        const ownerId = req.user.id;


        // Find owner's store
        const [stores] = await db.promise().query( `SELECT id  FROM stores WHERE owner_id = ? `,  [ownerId]);


        if (stores.length === 0) {

            return res.status(200).json({
                count: 0,
                ratings: []
            });

        }


        const storeId = stores[0].id;

        // Get ratings
        const [ratings] = await db.promise().query( ` SELECT ratings.id, users.name, ratings.rating FROM ratings
                                                      INNER JOIN users ON ratings.user_id = users.id
                                                      WHERE ratings.store_id = ?  ORDER BY ratings.id DESC `,  [storeId] );


        return res.status(200).json({
            count: ratings.length,
            ratings
        });

    }

    catch (error) {
        console.error(
            "Owner ratings error:",
            error
        );


        return res.status(500).json({
            message: "Failed to fetch ratings"

        });

    }

};


module.exports = { getOwnerRatings };