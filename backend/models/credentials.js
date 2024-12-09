const {sequelize} = require('../config/database');
const {DataTypes} = require('sequelize');


const Credentials = sequelize.define('Credentials', {
    CredentialsID:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },

    EmployeeID:{
        type: DataTypes.INTEGER,
        allowNull: false,
        references:{
            model:'Employees',
            key:'EmployeeID'
        }
    },

    Username:{
        type: DataTypes.STRING(100),
    },

    Password:{
        type: DataTypes.STRING
    }
},
{
    freezeTableName: true
});


module.exports = Credentials;