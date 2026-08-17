const mysql = require('mysql2');
require('dotenv').config();


const connection = mysql.createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    ssl: {
        rejectUnauthorized: true
    },
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});


connection.connect((err) => {
    if (err) {
        console.error('Database connection Failed:', err);
        return;
    } else {
        console.log('MySQL Database connected successfully');
    }
});

module.exports = connection;