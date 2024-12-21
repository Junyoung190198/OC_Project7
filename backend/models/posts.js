const {sequelize} = require('../config/database');
const {DataTypes} = require('sequelize');


const Posts = sequelize.define('Posts', {
    PostID:{
        type: DataTypes.INTEGER,
        primaryKey: true,
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
    },
    TotalLikes:{
        type: DataTypes.INTEGER
    },
    TotalDislikes:{
        type: DataTypes.INTEGER
    }
},
{
    timestamps: true,
    createdAt: 'CreatedAt',
    updatedAt: false,
    freezeTableName: true
});

module.exports = Posts;