const { DataTypes } = require('sequelize');
const {sequelize }= require('../config/database');

const MarkAsRead = sequelize.define('MarkAsRead', {
    MarkAsReadID:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false
    },

    PostID:{
        type: DataTypes.INTEGER,
        allowNull: false
    },

    EmployeeAccountID:{
        type: DataTypes.INTEGER,
        allowNull: false
    },

    Post_id:{
        type: DataTypes.UUID
    },

    EmployeeAccount_id:{
        type: DataTypes.UUID
    },

    isRead:{
        type: DataTypes.SMALLINT
    }
},
{
    timestamps: false,
    createdAt: false,
    updatedAt: false,
    freezeTableName: true
});

module.exports = MarkAsRead;