const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database');


const app = express(); // set up express server

// allow request to all origins (Need to update if going to productions: security mesures)
app.use(cors()); 
// set JSON parser so able to use req.body
app.use(express.json());

sequelize.authenticate()
.then(()=>{
    console.log('Well connected to SQL Server');
})
.catch((error)=>{
    console.log(error);
});


module.exports = app;