const path = require('path');
// Resolve path to find .env where env variables are, using path from node.js
require('dotenv').config({path: path.resolve(__dirname, '../.env')});

// require directlty the Sequelize class in the object sequelize so using "{}"
const {Sequelize} = require('sequelize');


/**
 * Creating instance of class Sequelize and passing 
 * mandatory args: username, password, database name
 * and not mandatory args in a object
 */
const sequelize = new Sequelize(
  process.env.DB_DATABASE,
  process.env.DB_USERNAME,
  process.env.DB_PASSWORD,
  {
    server: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'mssql',
    logging: console.log, 
    dialectOptions:{
      instanceName: 'SQLEXPRESS'
    }
  }  
);

const connectDatabase = ()=>{
  return sequelize.authenticate()
  .then(()=>{
    console.log('Well connected to SQL Server');
  })
  .catch((error)=>{
    console.log('Unable to connect to SQL Server');
    console.log(error);
  });
};


/**
 * Self calling arrow function for connection testing purpose
 */

/* (async ()=>{
  try{
    await sequelize.authenticate();
    console.log('Well connected to SQL Server database');
  }catch (error){
    console.log('Was not able to connect to the database:');
    console.log(error);
  }
})();
 */

module.exports = {sequelize, connectDatabase};