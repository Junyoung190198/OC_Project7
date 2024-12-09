const {sequelize} = require('../config/database');
const {DataTypes} = require('sequelize');


const Employees = sequelize.define('Employees', {
    EmployeeID:{
        type: DataTypes.INTEGER,
        primarykey: true,
        autoIncrement: true,
        allowNull: false
    },

    FirstName:{
        type: DataTypes.STRING(50),
        allowNull: true
    },

    LastName:{
        type: DataTypes.STRING(50),
        allowNull: true
    },

    Address:{
        type: DataTypes.TEXT,
        allowNull: true
    },

    PhoneNumber:{
        type: DataTypes.CHAR(10),
    },
    
},
{
    tableName:'Employee'
});


module.exports = Employees;