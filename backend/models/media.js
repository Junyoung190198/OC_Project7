const {sequelize} = require('../config/database');
const {DataTypes} = require('sequelize');

const Media = sequelize.define('Media',{
    MediaID:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },

    PostID:{
        type: DataTypes.INTEGER,
        allowNull: false,
        references:{
            model:'Posts',
            key:'PostID'
        }
    },

    MediaType:{
        type: DataTypes.STRING(50)
    }
},
{
    freezeTableName: true
});

module.exports = Media;