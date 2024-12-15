const jwt = require('jsonwebtoken');
const path = require('path');
require('dotenv').config({path: path.resolve(__dirname, '../.env')});

/**
 * Receives from user: access token for authentification
 */
module.exports = (req, res, next)=>{
    const auth = req.headers.authorization;
    // check if a token was actually sent and well sent
    if(!auth || !auth.startsWith('Bearer')){
        return res.status(401).json({
            error: new Error("Unauthorized request: Token doesn't exist or is malformed")
        });
    } 

    // headers would of form "Bearer <token>" so extract only the token
    const accessToken = auth.split(' ')[1];
    // check token validity: using legacy callback (err, decoded)
    jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET, (err, decoded)=>{
        if(err){
            return res.status(403).json({
                error: new Error("Unauthorized request: Invalid or expired access token"),
            });
        }

        // Assign to employeeAccount the entire payload
        // use employeeAccount._id in further endpoints to collect account's _id
        req.employeeAccount = decoded;
        next();
    });
}
