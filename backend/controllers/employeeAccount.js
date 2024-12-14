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

        Employees.create(newEmployee)
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

            EmployeeAccount.create(newEmployeeAccount)
            .then(()=>{
                res.status(201).json({
                    message: 'Employee information and account successfully saved'
                });
            })  
            .catch((error)=>{
                res.status(400).json(error);
            });

        })
        .catch((error)=>{
            res.status(400).json(error);
        });        
    })
    .catch((error)=>{
        res.status(500).json(error);
    });

    
};

/**
 * receives for EmployeeAccount: username, password
 * Instead of .then .catch block, could use a simple try catch block
 * as every error that could occur would be a 500 internal server error
 */
exports.login = async (req, res, next)=>{
    try{
        const request = req.body;
        // verifying employee's account exist in the DB
        const employeeAccount = await EmployeeAccount.findOne({where:{
            Username: request.Username
        }});
        if(!employeeAccount){
            return res.status(401).json({error: new Error("Employee account doesn't exist")})
        }

        // verifying the fk EmployeeID of this account matches
        // an employee of Employees table by checking by PK
        const employeeID = employeeAccount.EmployeeID;
        const employee = await Employees.findByPk(employeeID);
        if(!employee){
            return res.status(401).json({error: new Error("Unauthorized request: this account doesn't match any employee record")});
        }

        // hashing input password with infos contained in hashed password in the DB
        // Comparing both hashed password and return true if they match
        const hashedPassword = employeeAccount.Password;
        const plainPassword = request.Password;
        const validPassword = await bcrypt.compare(plainPassword, hashedPassword);
        if(!validPassword){
            return res.status(401).json({
                error: new Error("Invalid password")
            });
        }

        // Generate access token: short
        const accessToken = jwt.sign(
            {_id: employeeAccount._id},
            process.env.JWT_ACCESS_SECRET,
            {expiresIn: '5m'}
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
            sameSite: 'strict',
            masAge: 30 * 24 * 60 * 60 * 1000 // 30 days 
        });

        res.status(200).json({
            message: 'Login successful',
            token: accessToken
        });

    }catch(error){
        res.status(500).json(error);
    }
};








