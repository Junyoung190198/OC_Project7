const jwt = require('jsonwebtoken');
const path = require('path');
const Employees = require('../models/employees');
const EmployeeAccount = require('../models/employeeAccount');
require('dotenv').config({path: path.resolve(__dirname, '../.env')});


/**
 * function returning a Promise to be able to use 
 * try catch with legacy callback of jwt's verify method
 */

const jwtVerifyAsync = (token, secret)=>{
    return new Promise((resolve, reject)=>{
        jwt.verify(token, secret, (err, decoded)=>{
            if(err){
                return reject(err);
            }
            resolve(decoded);
        });
    });
};

/**
 * Receives from user: access token for authentification
 */
module.exports = async (req, res, next)=>{
    const auth = req.headers.authorization;
    // check if a token was actually sent and well sent
    if(!auth || !auth.startsWith('Bearer')){
        return res.status(401).json({
            error: "Unauthorized request: Token doesn't exist or is malformed"
        });
    } 

    try{
        const request = req.body;
        // headers would of form "Bearer <token>" so extract only the token
        const accessToken = auth.split(' ')[1];
        // call jwtVerifyAsync within the try catch
        // to use both legacy callback and await
        const decodedToken = await jwtVerifyAsync(accessToken, process.env.JWT_ACCESS_SECRET); 

        // Assign to employeeAccount the entire payload
        // use employeeAccount._id in further endpoints to collect account's _id
        req.EmployeeAccount = decodedToken;
        const _id = decodedToken._id;

        // Check if employeeAccount and employee exists
        const employeeAccount = await EmployeeAccount.findOne({where:{
            _id: _id
        }});
        if(!employeeAccount){
            return res.status(401).json({
                error: "Unauthorized request: Employee's account doesn't exist"
            });
        }
        const employeeID = employeeAccount.EmployeeID;
        const employee = await Employees.findByPk(employeeID);
        if(!employee){
            return res.status(401).json({
                error: "Unauthorized request: Employee doesn't exist" 
            });
        }
        // More security check: compare account id with account id
        //  that was in token's payload
        const requestAccountId = request._id;
        const tokenAccountId = _id;
        if(!requestAccountId || requestAccountId !== tokenAccountId){
            return res.status(401).json({
                error: "Unauthorized request: account id missing in the request or provided id is invalid"
            });
        }
        
        // Passed all authentification layers, passes to the next middleware
        next();

    }catch(error){
         // Because of the reject Promise, the invalid ot expires token
         // error will be caught in the catch block, but we want to throw
         // a 401 status error and not 500. So we catch specifically the
         // error name and if true instead throw a 403 status error for unauthorized
         if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
            return res.status(403).json({
                message: "Unauthorized request: Invalid or expired access token",
                error: error
            });
        }
        res.status(500).json(error);
    }    
};






    
