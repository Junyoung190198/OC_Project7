const {sequelize} = require('../config/database');
const {DataTypes} = require('sequelize');


const Posts = sequelize.define('Posts', {
    PostID:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false
    },

    EmployeeID:{
        type: DataTypes.INTEGER,
        allowNull: false
    },

    PostContent:{
        type: DataTypes.STRING
    },
    
    PostTitle:{
        type: DataTypes.STRING
    },

    _id:{
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