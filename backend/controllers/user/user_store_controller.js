const db = require("../../dbconnection");



// Get all stores for normal user
const getUserStores = async (req, res) => {

    try {
        
        const userId = req.user.id;


        // Get search filters

        const { name, address, search } = req.query;

        let query = ` SELECT s.id, s.name, s.email, s.address, COALESCE( AVG(allRatings.rating), 0 ) AS overallRating,
                        myRating.rating AS userRating FROM stores s 

                        LEFT JOIN ratings allRatings
                            ON s.id = allRatings.store_id

                            LEFT JOIN ratings myRating
                        ON s.id = myRating.store_id
                        AND myRating.user_id = ?

                        WHERE 1 = 1
        `;



        const values = [  userId ];


        // Search by store name
        if (name) 
            { query += ` AND s.name LIKE ? `;

            values.push( `%${name}%` );
        }



        // Search by store address
        if (address)
             {
            query += ` AND s.address LIKE ? `;

            values.push( `%${address}%` ); 
        }

        // Search by name or address
        if (search) {
            query += ` AND ( s.name LIKE ? OR s.address LIKE ? ) `;

            values.push(
                `%${search}%`,
                `%${search}%`
            );

        }

        query += `  GROUP BY s.id, s.name, s.email, s.address, myRating.rating ORDER BY s.id DESC `;


        const [stores] = await db.promise().query(  query , values);


        return res.status(200).json({

            count: stores.length,
            stores: stores

        });

    }


    catch (error) { 
        console.error(  "Get user stores error:", error );

        return res.status(500).json({
            message: "Failed to fetch stores"
        });

    }

};



module.exports = { getUserStores };
