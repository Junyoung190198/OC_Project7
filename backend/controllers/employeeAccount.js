const employeeAccount = require('../models/employeeAccount');

/**
 * receives for Employees: FirstName, LastName, Address, unique PhoneNumber,
 * unique Email
 * receives for EmployeeAccount: unique username, unique password
 * creates for EmployeeAccount: _id
 */
exports.signup = (req, res, next)=>{
    
};

exports.login = (req, res, next)=>{

};


// with EmployeeAccount's _id search in Employees table 
// --> search if exist
