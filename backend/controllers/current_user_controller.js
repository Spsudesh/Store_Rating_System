const db = require("../dbconnection");

const getCurrentUser = async (req, res) => {
    try {
        const userId = req.user.id;

        const [rows] = await db.promise().query(
            `SELECT id, name, email, address, role FROM users WHERE id = ?`, [userId]
        );

        if (rows.length === 0) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        return res.status(200).json({
            user: rows[0]
        });
        
    } catch (error) {
        console.error("Get current user error", error);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
};

module.exports = { getCurrentUser };
