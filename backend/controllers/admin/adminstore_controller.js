const db = require("../../dbconnection");


//add store
const addStore = async (req, res) => {

    try {
        const {name,email, address,owner_id} = req.body;

        if (!name || !email || !address || !owner_id) 
            {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        const trimmedName = name.trim();
        const trimmedEmail = email.trim();
        const trimmedAddress = address.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (trimmedName.length < 20 || trimmedName.length > 60) {
            return res.status(400).json({
                message: "Store name must be 20-60 characters"
            });
        }

        if (!emailRegex.test(trimmedEmail)) {
            return res.status(400).json({
                message: "Enter a valid store email address"
            });
        }

        if (trimmedAddress.length > 400) {
            return res.status(400).json({
                message: "Store address cannot exceed 400 characters"
            });
        }

        // Check owner
        const [owner] = await db.promise().query( ` SELECT id, role FROM users WHERE id = ? `, [owner_id] );

        if (owner.length === 0) 
            {
            return res.status(404).json({
                message: "Store owner not found"
            });

        }


        // Make sure selected user is STORE_OWNER
        if (owner[0].role !== "STORE_OWNER") {
            return res.status(400).json({
                message: "Selected user is not a store owner"
            });

        }


        const [existingStore] = await db.promise().query( ` SELECT id FROM stores WHERE owner_id = ? `, [owner_id] );

        if (existingStore.length > 0) {
            return res.status(409).json({
                message: "This store owner already has a store"
            });
        }


        // Insert store
        const [result] = await db.promise().query(
            `
            INSERT INTO stores (name, email, address, owner_id) VALUES (?, ?, ?, ?)  `, [ trimmedName, trimmedEmail, trimmedAddress, owner_id] );

        return res.status(201).json({
            message: "Store created successfully",
            store: { id: result.insertId, name: trimmedName, email: trimmedEmail,address: trimmedAddress,  owner_id }
        });


    } catch (error) {

        console.error("Add store error:", error);

        return res.status(500).json({
            message: "Failed to create store"
        });

    }
};

// fetch stores data
const getStores = async (req, res) => {

    try {

        const {  search, owner_id } = req.query;


        let query = `
            SELECT
                s.id,
                s.name,
                s.email,
                s.address,
                s.owner_id,
                u.name AS owner_name,
                ROUND(AVG(r.rating), 1) AS store_rating,
                COUNT(r.id) AS total_ratings
            FROM stores s
            LEFT JOIN users u ON s.owner_id = u.id
            LEFT JOIN ratings r ON r.store_id = s.id
            WHERE 1 = 1
        `;


        const values = [];


        // Search anything related to store

        if (search) {
            query += ` AND ( s.name LIKE ?
                    OR s.email LIKE ?
                    OR s.address LIKE ?
                    OR u.name LIKE ?
                )
            `;


            const searchValue =
                `%${search}%`;

            values.push(searchValue);

            values.push(searchValue);

            values.push(searchValue);

            values.push(searchValue);

        }


        // Filter by owner

        if (owner_id) {

            query += ` AND s.owner_id = ? `;

            values.push(owner_id);

        }


        query += `
            GROUP BY s.id, s.name, s.email, s.address, s.owner_id, u.name
            ORDER BY s.id DESC
        `;


        const [stores] =  await db.promise().query( query, values );

        return res.status(200).json({
            count: stores.length, stores
        });


    } catch (error) {

        console.error( "Get stores error:", error );


        return res.status(500).json({
            message: "Failed to fetch stores"
        });

    }

};


module.exports = { addStore, getStores };
