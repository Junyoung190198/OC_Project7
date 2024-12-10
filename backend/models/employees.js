const {sequelize} = require('../config/database');
const {DataTypes} = require('sequelize');


const Employees = sequelize.define('Employees', {
    EmployeeID:{
        type: DataTypes.INTEGER,
        primarykey: true,
        allowNull: false
    },

    FirstName:{
        type: DataTypes.STRING,
    },

    LastName:{
        type: DataTypes.STRING,
    },

    Address:{
        type: DataTypes.STRING,
    },

    PhoneNumber:{
        type: DataTypes.STRING,
    },
    
},
{
    freezeTableName: true,
    timestamps: false
});


module.exports = Employees;