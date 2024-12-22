const EmployeeAccount = require('../models/employeeAccount');
const Employees = require('../models/employees');
const bcrypt = require('bcrypt');
const {v4: uuidv4} = require('uuid');
const path = require('path');
const jwt = require('jsonwebtoken');
require('dotenv').config({path: path.resolve(__dirname, '../.env')});

/*
const crypto = require('crypto');

Using crypto library to generate random secret key: for jwt secret key
const secretKey = crypto.randomBytes(64).toString('hex');
console.log(secretKey); */

/**
 * receives for Employees: FirstName, LastName, Address, unique PhoneNumber,
 * unique Email
 * receives for EmployeeAccount: unique username, unique password
 * creates for EmployeeAccount: _id
 * Using 'fields' option to prevent sequelize from trying to insert
 * values in the already identity auto increment pks
 */
exports.signup = (req, res, next)=>{
    const request = req.body;
    const inputPassowrd = request.Password;
    const saltRounds = 10;
    // hashing process, giving rounds of salt and the input password
    bcrypt.hash(inputPassowrd, saltRounds)
    .then((hashedPassword)=>{
        const newEmployee = {
            FirstName: request.FirstName,
            LastName: request.LastName,
            Address: request.Address,
            PhoneNumber: request.PhoneNumber,
            Email: request.Email
        };


        Employees.create(newEmployee, { fields: ['FirstName', 'LastName', 'Address', 'PhoneNumber', 'Email'] },)
        .then((createdEmployee)=>{
            const EmployeeID = createdEmployee.EmployeeID;
            // create uuid for external identification of account
            const newEmployeeAccountId = uuidv4();
            const newEmployeeAccount = {
                Username: request.Username,
                Password: hashedPassword,
                EmployeeID: EmployeeID,
                _id: newEmployeeAccountId
            };

            EmployeeAccount.create(newEmployeeAccount, { fields: ['Username', 'Password', 'EmployeeID', '_id'] })
            .then(()=>{
                res.status(201).json({
                    message: 'Employee information and account successfully saved'
                });
            })  
            .catch((error)=>{
                res.status(400).json({
                    message: "Couldn't create new employee's account",
                    error: error
                });
            });

        })
        .catch((error)=>{
            res.status(400).json({
                message: "Couldn't create new employee",
                error: error
            });
        });        
    })
    .catch((error)=>{
        res.status(500).json({
            message: 'Internal server error',
            error: error.message || error
        });
    });
};

/**
 * receives for EmployeeAccount: username, password
 * Instead of .then .catch block, could use a simple try catch block
 * as every error that could occur would be a 500 internal server error
 * RE: Finally used try catch
 */
exports.login = async (req, res, next)=>{
    try{
        const request = req.body;
        // verifying employee's account exist in the DB
        const employeeAccount = await EmployeeAccount.findOne({where:{
            Username: request.Username
        }});
        if(!employeeAccount){
            return res.status(401).json({error: "Username doesn't match: Employee account doesn't exist"})
        }

        // verifying the fk EmployeeID of this account matches
        // an employee of Employees table by checking by PK
        const employeeID = employeeAccount.EmployeeID;
        const employee = await Employees.findByPk(employeeID);
        if(!employee){
            return res.status(401).json({error: "Unauthorized request: this account doesn't match any employee record"});
        }

        // hashing input password with infos contained in hashed password in the DB
        // Comparing both hashed password and return true if they match
        const hashedPassword = employeeAccount.Password;
        const plainPassword = request.Password;
        const validPassword = await bcrypt.compare(plainPassword, hashedPassword);
        if(!validPassword){
            return res.status(401).json({
                error: "Invalid password"
            });
        }

        // Generate access token: short
        const accessToken = jwt.sign(
            {_id: employeeAccount._id},
            process.env.JWT_ACCESS_SECRET,
            {expiresIn: '30m'}
        );        
        // Generate refresh token: long
        const refreshToken = jwt.sign(
            {_id: employeeAccount._id},
            process.env.JWT_REFRESH_SECRET,
            {expiresIn: '30d'}
        );

        // Send refresh token as a HttpOnly cookie 
        // to ensure security
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            sameSite: 'Strict',
            maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days 
            path: '/groupomania/auth'
        });

        res.status(200).json({
            message: 'Login successful',
            token: accessToken
        });

    }catch(error){
        res.status(500).json({
            message: 'Internal server error',
            error: error.message || error
        });
    }
};


/**
 * From user: receives refresh token,
 * resend an access token if received refresh token is valid
 */
exports.refreshToken = (req, res, next)=>{
    const refreshToken = req.cookies.refreshToken;
    if(!refreshToken){
        return res.status(401).json({error: "No refresh token provided"});
    }

    jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, (err, decoded)=>{
        // verify method returns in err if invalid token
        // returns in decoded the decoded payload of the token if valid
        if(err){
            return res.status(403).json({error: "Invalid refresh token"});
        }

        const accessToken = jwt.sign(
            {_id: decoded._id},
            process.env.JWT_ACCESS_SECRET,
            {expiresIn: '30m'}
        );

        res.status(200).json({
            message: 'Access token successfully created',
            token: accessToken
        });
    });
};

/**
 * Controller to handle logout logic, delete refresh token in cookie.
 * 
 * For access token, frontend manipulation is needed to
 * delete it when logout
 */
exports.logout = (req, res, next)=>{
    const cookies = req.cookies;
    if(!cookies || !cookies.refreshToken){
        // User already logged out
        // send back 204 status with it's corresponding string
        return res.sendStatus(204);
    }

    // delete refresh cookie when logout to ensure login again when 
    // accessing other endpoints
    res.clearCookie('refreshToken', {
        httpOnly: true,
        sameSite: 'Strict', 
        path: '/groupomania/auth'
    });

    // send back 204 status with no content: self explainatory for logout
    res.sendStatus(204);
};
