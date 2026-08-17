const db = require("../../dbconnection");
const bcrypt = require("bcrypt");


//add user
const addUser = async (req, res) => {

    try {

        const { role, name, email, password, address } = req.body;

        // Check required fields
        if (!role || !name || !email || !password || !address)
        {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        const trimmedName = name.trim();
        const trimmedEmail = email.trim();
        const trimmedAddress = address.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const passwordRegex = /^(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,16}$/;

        if (trimmedName.length < 20 || trimmedName.length > 60) {
            return res.status(400).json({
                message: "Name must be 20-60 characters"
            });
        }

        if (!emailRegex.test(trimmedEmail)) {
            return res.status(400).json({
                message: "Enter a valid email address"
            });
        }

        if (trimmedAddress.length > 400) {
            return res.status(400).json({
                message: "Address cannot exceed 400 characters"
            });
        }

        if (!passwordRegex.test(password)) {
            return res.status(400).json({
                message: "Password must be 8-16 characters with at least one uppercase letter and one special character"
            });
        }


        // Check email already exists
        const [existingUser] = await db.promise().query(`SELECT id FROM users WHERE email = ? `, [trimmedEmail] );


        if (existingUser.length > 0)
             {
            return res.status(409).json({
                message: "Email already exists"
            });

        }


    // Hash password
    const hashedPassword = await bcrypt.hash(password,10);


    // Insert new user
    const [result] = await db.promise().query(` INSERT INTO users ( role, name, email, password, address ) VALUES (?, ?, ?, ?, ?) `,[ role, trimmedName, trimmedEmail,hashedPassword,trimmedAddress] );


        return res.status(201)
        .json({ message: "User created successfully", user: { id: result.insertId, role, name: trimmedName, email: trimmedEmail, address: trimmedAddress }} );


    } catch (error) 
    {
        console.error( "Add user error:", error);

        return res.status(500).json({
            message: "Failed to create user"

        });

    }

};


//get users
const getUsers = async (req, res) => {

    try {
        const { search, role } = req.query;

        let query = `
            SELECT
                u.id,
                u.role,
                u.name,
                u.email,
                u.address,
                COUNT(DISTINCT s.id) AS total_stores,
                GROUP_CONCAT(DISTINCT s.name SEPARATOR ', ') AS store_names,
                ROUND(AVG(r.rating), 1) AS store_rating,
                COUNT(r.id) AS total_ratings
            FROM users u
            LEFT JOIN stores s ON s.owner_id = u.id
            LEFT JOIN ratings r ON r.store_id = s.id
            WHERE 1 = 1
        `;

        const values = [];


    
        //search filter
        if (search) 
            {
            query += ` AND ( u.name LIKE ? OR u.email LIKE ? ) `; 
            values.push( `%${search}%`, `%${search}%` );
        }


    
        //role filter 
        if ( role && role !== "ALL" ) 
            {
            query += ` AND u.role = ? `;
            values.push(role);
           }


           //sort
        query += ` GROUP BY u.id, u.role, u.name, u.email, u.address ORDER BY u.id DESC `;



        // Execute query
        const [users] = await db.promise().query( query, values );

        // Send response
        return res.status(200).json({ count: users.length, users });

    }
     catch (error) 
     {
        console.error("Get users error:",error );

        return res.status(500)
        .json({ message: "Failed to fetch users" });

    }

};

module.exports = { addUser,getUsers };
