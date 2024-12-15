const {sequelize} = require('../config/database');
const {DataTypes} = require('sequelize');


const Posts = sequelize.define('Posts', {
    PostID:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrementIdentity: true,
        allowNull: false
    },

    EmployeeAccountID:{
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
        type: DataTypes.UUID,
        allowNull: false
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