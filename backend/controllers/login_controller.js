const { checkUserByEmail } = require('../models/user_model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const login = async (req, res) => {
    
    const { email, password } = req.body;

    try {
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }
        
         // checking user email exist 
        const user = await checkUserByEmail(email);
        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password' });

        }
      
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }   
       

        //  token
        const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
        
    
        return res.status(200).json({ message: 'Login successful', token , 
                                    user: { id: user.id,  name: user.name, email: user.email, role: user.role} });
                                        

    } 
    catch (error)
     {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }


};

module.exports = { login };