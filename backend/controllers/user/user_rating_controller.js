const db = require("../../dbconnection");



// Submit a new rating
const submitRating = async (req, res) => {

    try {

        // User ID comes from JWT

        const userId = req.user.id;

        const { storeId, rating } = req.body;

        // Check required fields


        if (!storeId || !rating) 
            {
            return res.status(400).json({
                message: "Store ID and rating are required"
            });
        }

        // Check rating range
        if ( rating < 1 ||   rating > 5)
             {
            return res.status(400).json({
                message:
                    "Rating must be between 1 and 5" 
            });

        }

        // Check whether store exists
        const [stores] = await db.promise().query( ` SELECT id FROM stores WHERE id = ? `,  [storeId] );


        if (stores.length === 0) { return res.status(404)
             .json({ message: "Store not found" });
        }

        // Check whether user already rated this store

        const [existingRating] =
            await db.promise().query( ` SELECT id FROM ratings WHERE user_id = ? AND store_id = ? `, [ userId, storeId ] );

        if (existingRating.length > 0)
            {
            return res.status(409).json({ message: "You have already rated this store" });
        }


        // Insert rating

        const [result] =
                 await db.promise().query( ` INSERT INTO ratings (  user_id, store_id, rating ) VALUES (?, ?, ?) `, [ userId, storeId, rating ] );


         return res.status(201).json({ 
             message: "Rating submitted successfully",
            rating: {
                id: result.insertId,
                userId: userId,
                storeId: storeId,
                rating: rating

            }

        });

    }


    catch (error) {
        console.error( "Submit rating error:", error );


        return res.status(500).json({
            message: "Failed to submit rating"
        });

    }

};



// Update user's  rating

const updateRating = async (req, res) => {

    try {

        // User ID  comes from JWT 
        const userId = req.user.id;

        const { storeId  } = req.params;

        const { rating } = req.body;


        if (!rating) {
              return res.status(400).json({
               message: "Rating is required"

            });

        }

        // Rating must be between 1 and 5

        if ( rating < 1 ||  rating > 5 ) 
            {
            return res.status(400).json({
                message: "Rating must be between 1 and 5"
            });

        }



        // Check user's existing rating

        const [existingRating] = await db.promise().query( ` SELECT id FROM ratings WHERE user_id = ?  AND store_id = ? `, [userId,storeId] );

        if (existingRating.length === 0) {

            return res.status(404).json({
                message: "You have not rated this store yet"
            });

        }



        // Update rating

        await db.promise().query( ` UPDATE ratings SET rating = ?  WHERE user_id = ?  AND store_id = ? `, [ rating, userId, storeId] );


        return res.status(200).json({
            message: "Rating updated successfully",
            rating: rating

        });

    }


    catch (error) {
        console.error( "Update rating error:", error );


        return res.status(500).json({
            message: "Failed to update rating"
        });

    }

};



module.exports = { submitRating, updateRating };