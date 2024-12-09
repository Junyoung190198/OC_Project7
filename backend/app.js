const express = require('express');
const cors = require('cors');
const syncModels = require('./models/index');


const app = express(); // set up express server

// allow request to all origins (Need to update if going to productions: security mesures)
app.use(cors()); 
// set JSON parser so able to use req.body
app.use(express.json());

syncModels();

module.exports = app;