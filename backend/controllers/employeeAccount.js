const EmployeeAccount = require('../models/employeeAccount');
const Employees = require('../models/employees');
const Posts = require('../models/posts');
const Media = require('../models/media');

const bcrypt = require('bcrypt');
const {v4: uuidv4} = require('uuid');
const jwt = require('jsonwebtoken');

const path = require('path');
require('dotenv').config({path: path.resolve(__dirname, '../.env')});
const fs = require('fs');

/*
const crypto = require('crypto');

Using crypto library to generate random secret key: for jwt secret key
const secretKey = crypto.randomBytes(64).toString('hex');
console.log(secretKey); */

/**
 * function to check if ids match for every request 
 * that need a authentification:
 * More security check: compare account id with account id
 * that was in token's payload
 */


const checkUnauthorizedRequest = (request, reqTokenPayload)=>{
    // extracting _id passed by authentification middleware
    // that was decoded in the token
    const tokenAccountId = reqTokenPayload._id;
    const requestAccountId = request.account_id;
            if(!requestAccountId || requestAccountId !== tokenAccountId){        
                throw new Error("Unauthorized request: account id missing in the request or provided id is invalid")
            }        
}


/**
 * Function to delete files asynchronously
 */

const deleteFiles = (existingFiles) => {
    return new Promise((resolve, reject) => {
        const deleteFilePromises = existingFiles.map(file => {
            return new Promise((resolve, reject) => {
                fs.unlink('uploads/' + file, (err) => {
                    if (err) {
                        console.error(`Error deleting file: ${file}`, err);
                        reject(err);  // Reject the promise on error
                    } else {
                        console.log(`Deleted file: ${file}`);
                        resolve();  // Resolve the promise when the file is successfully deleted
                    }
                });
            });
        });

        // Wait for all delete operations to finish
        Promise.all(deleteFilePromises)
            .then(resolve)  // Resolve the outer promise when all files are deleted
            .catch(reject);  // Reject the outer promise if any file deletion fails
    });
};


/**
 * receives for Employees: FirstName, LastName, Address, unique PhoneNumber,
 * unique Email
 * receives for EmployeeAccount: unique Email, unique Password
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
                Username: request.Email,
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
                    error: error.message || error
                });
            });

        })
        .catch((error)=>{
            res.status(400).json({
                message: "Couldn't create new employee",
                error: error.message || error
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
 * receives for EmployeeAccount: Username, Password
 * Instead of .then .catch block, could use a simple try catch block
 * as every error that could occur would be a 500 internal server error
 * RE: Finally used try catch
 */
exports.login = async (req, res, next)=>{
    try{
        const request = req.body;
        // verifying employee's account exist in the DB
        const employeeAccount = await EmployeeAccount.findOne({where:{
            Username: request.Email
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

        // Giving back the EmployeeAccount's _id 
        const _id = employeeAccount._id;

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
            httpOnly: false, // Set to true for production to enhance security
            sameSite: 'none', // Required for cross-origin cookies
            secure: false, // Set to true in production if using HTTPS
            maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
            path: '/',
            domain: '.localhost', // Ensure this matches your frontend's domain
        });
        console.log(refreshToken)

        res.status(200).json({
            message: 'Login successful',
            token: accessToken,
            _id: _id
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
    console.log(refreshToken, req.body)
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


/**
 * Receives for EmployeeAccount: _id, token auth
 */
exports.getAccount = async (req, res, next)=>{
    try{
        const request = req.body;
        const params = req.params;
        const account_id = params.id;
        const reqTokenPayload = req.tokenPayload;

        try{
            checkUnauthorizedRequest(request, reqTokenPayload);
        }catch(error){
            return res.status(401).json({
                error: error.message
            });
        }

        const employeeAccount = await EmployeeAccount.findOne({
            where:{
                _id: account_id
            },
            attributes: ['Username', '_id', 'CreatedAt'],
            include: [
                {
                    model: Employees,
                    as: 'employee',
                    attributes: ['FirstName', 'LastName', 'Address', 'PhoneNumber']
                }
            ]
        });

        if(!employeeAccount){
            return res.status(404).json({
                error: "This account doesn't exist"
            });
        }

        res.status(200).json({
            message: 'Successful retrieved this account',
            account: employeeAccount
        });

    }catch(error){
        console.error(error);
        res.status(500).json({            
            message: 'Internal server error',
            error: error.message || error
        });
    }
};

/**
 * Receives for EmployeeAccount: _id, token
 */
exports.deleteAccount = async (req, res, next)=>{
    try{
        const params = req.params;
        const account_id = params.id;
        const request = req.body;
        const reqTokenPayload = req.tokenPayload;

        try{
            checkUnauthorizedRequest(request, reqTokenPayload);
        }catch(error){
            return res.status(401).json({
                error: error.message
            });
        }

        // Search if employee account exists
        const employeeAccount = await EmployeeAccount.findOne({
            where:{
                _id: account_id
            }
        });

        if(!employeeAccount){
            return res.status(404).json({
                error: "This account doesn't exist or is already deleted"
            });
        }

        // Find all posts related to this account anc extract the posts's PKs
        const employeeAccountId = employeeAccount.EmployeeAccountID;
        // Find Employee info related to this account
        const employeeId = employeeAccount.EmployeeID;

        const posts = await Posts.findAll({
            where:{
                EmployeeAccountID: employeeAccountId
            }
        })

        const postIds = posts.map(post => post.PostID);

        const media = await Media.findAll({
            where:{
                PostID: postIds
            },
            attributes: ['MediaUrl']
        });
        
        if(media){
            const files = media.map(media=> media.MediaUrl.split('/uploads/')[1]);
            await deleteFiles(files);

            // Delete all medias related to those posts
            await Media.destroy({
                where:{
                    PostID: postIds
                }
            });
        }

        // Then delete all posts related to this account
        await Posts.destroy({
            where:{
                PostID: postIds
            }
        });

        // Then delete the account
        await EmployeeAccount.destroy({
            where:{
                _id: account_id
            }
        });

        // Then delete employee's info related to this account
        await Employees.destroy({
            where:{
                EmployeeID: employeeId
            }
        });

        res.status(200).json({
            message: 'Account successfully deleted'
        });

    }catch(error){
        console.error(error);
        res.status(500).json({            
            message: 'Internal server error',
            error: error.message || error
        });
    }
};