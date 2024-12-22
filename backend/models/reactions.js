const { DataTypes } = require('sequelize');
const {sequelize }= require('../config/database');

const Reactions = sequelize.define('Reactions', {
    ReactionID:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false
    },

    EmployeeAccountID:{
        type: DataTypes.INTEGER,
        allowNull: false
    },

    PostID:{
        type: DataTypes.INTEGER,
        allowNull: false
    },

    ReactionType:{
        type: DataTypes.SMALLINT
    }
},
{
    timestamps: true,
    createdAt: 'CreatedAt',
    updatedAt: false,
    freezeTableName: true
});


module.exports = Reactions;