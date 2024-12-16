const {sequelize} = require('../config/database');
const {DataTypes} = require('sequelize');


const EmployeeAccount = sequelize.define('EmployeeAccount', {
    EmployeeAccountID:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false
    },

    EmployeeID:{
        type: DataTypes.INTEGER,
        allowNull: false
    },

    Username:{
        type: DataTypes.STRING,
        allowNull: false
    },

    Password:{
        type: DataTypes.STRING,
        allowNull: false
    },

    _id:{
        type: DataTypes.UUID,
        allowNull: false
    }
},
{
    freezeTableName: true,
    timestamps: false
});


module.exports = EmployeeAccount;