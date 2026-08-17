const db = require("../../dbconnection");


// fetch store ratings

const getRatings = async (req, res) => {

    try {
        const { search, rating } = req.query;


        let query = ` SELECT r.id, r.rating, r.user_id, u.name AS user_name, r.store_id, s.name AS store_name, s.address AS address FROM ratings r
                      LEFT JOIN users u ON r.user_id = u.id
                      LEFT JOIN stores s ON r.store_id = s.id WHERE 1 = 1 `;


        const values = [];


        // Search by user name, store name and address
        if (search) {
            query += ` AND ( u.name LIKE ? OR s.name LIKE ? OR s.address LIKE ? )`;

            const searchValue = `%${search}%`;

            values.push(searchValue);
            values.push(searchValue);
            values.push(searchValue);

        }


        // Filter by rating

        if (rating) 
            {
            query += ` AND r.rating = ? `;
            values.push(rating);
        }


        // desc sorting

        query += ` ORDER BY r.id DESC `;

        const [ratings] = await db.promise().query( query, values );


        return res.status(200).json({
            count: ratings.length,
            ratings
        });


    } catch (error) {

        console.error("Get ratings error:",error );
        return res.status(500).json({ message: "Failed to fetch ratings" });

    }

};


module.exports = { getRatings };
