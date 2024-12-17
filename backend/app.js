const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const syncModels = require('./models/index');
const employeeAccountRoutes = require('./routes/employeeAccount');
const postsRoutes = require('./routes/posts');
const path = require('path');

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

// Serve static files:
// Serve uploaded videos
app.use('/uploads/videos', express.static(path.join(__dirname, 'uploads/videos')));
// Serve uploaded gifs
app.use('uploads/gifs', express.static(path.join(__dirname, 'uploads/gifs')));
// Serve uploaded images
app.use('uploads/images', express.static(path.join(__dirname, 'uploads/images')));

// Authentification routes loading: signup, login etc ...
app.use('/groupomania/auth', employeeAccountRoutes);
// All posting related routes loading: upload posts, like/dislike etc...
app.use('/groupomania/posts', postsRoutes);

module.exports = app;