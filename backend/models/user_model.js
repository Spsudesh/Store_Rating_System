const db = require('../dbconnection');

       
        const createUser = async ({role ,name, email, password, address}) => 
                {
                  const [result] = await db.promise().query(` insert into users (role, name, email, password, address) values ( ? , ? , ? , ? , ? )`, [role, name, email, password, address]);

                  return result;             
        };  

        
        //this fun is to check user is alredy exist or not 
        const checkUserByEmail = async (email) => {
           const [rows] = await db.promise().query(`SELECT * FROM users WHERE email = ?`, [email]);

           return rows[0];
       }

module.exports = { createUser, checkUserByEmail };