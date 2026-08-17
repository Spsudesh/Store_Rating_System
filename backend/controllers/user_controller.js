const bcrypt = require('bcrypt');
const { createUser, checkUserByEmail } = require('../models/user_model');


const signup = async (req, res) =>
{
    const { role ,name, email, password, address } = req.body;

    try {

             if (!role|| !name || !email || !password || !address) {
                return res.status(400).json({ message: 'All fields are required' });
            }   

            const trimmedName = name.trim();
            const trimmedEmail = email.trim();
            const trimmedAddress = address.trim();
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            const passwordRegex = /^(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,16}$/;

            if (trimmedName.length < 20 || trimmedName.length > 60) {
                return res.status(400).json({ message: 'Name must be 20-60 characters' });
            }

            if (!emailRegex.test(trimmedEmail)) {
                return res.status(400).json({ message: 'Enter a valid email address' });
            }

            if (trimmedAddress.length > 400) {
                return res.status(400).json({ message: 'Address cannot exceed 400 characters' });
            }

            if (!passwordRegex.test(password)) {
                return res.status(400).json({ message: 'Password must be 8-16 characters with at least one uppercase letter and one special character' });
            }

            // to Check .... user already present
            const User = await checkUserByEmail(trimmedEmail);
            if (User) {
                return res.status(400).json({ message: 'User already exists' });
            }

            // Hash the password
            const hashedPassword = await bcrypt.hash(password, 10);

            // new user
            const newUser = await createUser({ role , name: trimmedName, email: trimmedEmail, password: hashedPassword, address: trimmedAddress });
            res.status(201).json({ message: 'User created successfully'});

    }

    catch (error) {
        console.error('Error during signup:', error);
        res.status(500).json({ message: 'Internal server error' });
    }

}

module.exports = { signup };
