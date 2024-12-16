const {sequelize} = require('../config/database');
const {DataTypes} = require('sequelize');

const Media = sequelize.define('Media',{
    MediaID:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false
    },

    PostID:{
        type: DataTypes.INTEGER,
        allowNull: false,
    },

    MediaType:{
        type: DataTypes.STRING
    },

    MediaUrl:{
        type: DataTypes.STRING
    }
},
{
    freezeTableName: true,
    timestamps: false
});

module.exports = Media;