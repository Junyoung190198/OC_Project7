const jwt = require('jsonwebtoken');
const path = require('path');
const Employees = require('../models/employees');
const EmployeeAccount = require('../models/employeeAccount');
require('dotenv').config({path: path.resolve(__dirname, '../.env')});

/**
 * Receives from user: access token for authentification
 */
module.exports = (req, res, next)=>{
    const auth = req.headers.authorization;
    const request = req.body;
    // check if a token was actually sent and well sent
    if(!auth || !auth.startsWith('Bearer')){
        return res.status(401).json({
            error: "Unauthorized request: Token doesn't exist or is malformed"
        });
    } 

    // headers would of form "Bearer <token>" so extract only the token
    const accessToken = auth.split(' ')[1];
    // check token validity: using legacy callback (err, decoded)
    jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET, async (err, decoded)=>{
        if(err){
            return res.status(403).json({
                error: "Unauthorized request: Invalid or expired access token"
            });
        }

        try{
        // Assign to employeeAccount the entire payload
        // use employeeAccount._id in further endpoints to collect account's _id
        req.EmployeeAccount = decoded;
        const _id = req.employeeAccount._id;

        // Check if employeeAccount and employee exists
        const employeeAccount = await EmployeeAccount.findOne({
            where:{_id: _id}
        });        
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

        // More security check: compare account id with account id that was in token's payload
        const requestAccountId = request._id;
        if(requestAccountId && requestAccountId !== _id){
            return res.status(401).json({
                error: "Unauthorized request: account id missing in the request or provided id is invalid"
            });
        }

        // Passed all authentification layers, passes to the next middleware
        next();

        }catch(error){
            res.status(500).json(error);
        }
    });
};
