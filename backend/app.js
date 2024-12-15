const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const syncModels = require('./models/index');
const employeeAccountRoutes = require('./routes/employeeAccount');
const postsRoutes = require('./routes/posts');


const app = express(); // set up express server

// allow request to all origins (Need to update if going to productions: security mesures)
app.use(cors()); 
// set JSON parser so able to use req.body
app.use(express.json());
// Allow cookies parsing 
app.use(cookieParser());

// Connecting to the database and syncing all models to existing tables
syncModels()
.then(()=>{
    console.log('Succesfull connection and model syncing to the mssql');
})
.catch((error)=>{
    console.error('Unable to connect or syncing models to the database', error);
});

// Authentification routes loading: signup, login etc ...
app.use('/groupomania/auth', employeeAccountRoutes);
// All posting related routes loading: upload posts, like/dislike etc...
app.use('/groupomania/posts', postsRoutes);

module.exports = app;