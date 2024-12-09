const {sequelize} = require('../config/database');
const {DataTypes} = require('sequelize');
const Employees = require('./employees');

const Posts = sequelize.define('Posts', {
    PostID:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },

    EmployeeID:{
        type: DataTypes.INTEGER,
        references:{
            model: 'Employees',
            key: 'EmployeeID'
        },
        allowNull: false
    },

    PostContent:{
        type: DataTypes.TEXT
    },
    
    PostTitle:{
        type: DataTypes.STRING
    }
},
{
    timestamps: true,
    createdAt: 'PostDate',
    updatedAt: false
},
{
    freezeTableName: true
});

module.exports = Posts;