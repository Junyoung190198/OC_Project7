const Posts = require('../models/posts');
const EmployeeAccount = require('../models/employeeAccount');
const Media = require('../models/media');
const {v4: uuidv4} = require('uuid');
const path = require('path');
require('dotenv').config({path: path.resolve(__dirname, '../.env')});


/**
 * Receives for Posts: PostTitle, PostContent.
 * if uploading files, receives for Posts
 */
exports.createPost = async (req, res, next)=>{
   try{
    const contentType = req.get('Content-Type');
    let request;
    // extracting _id passed by authentification middleware
    // that was decoded in the token
    const tokenAccountId = req.tokenPayload._id;
    // if it's a form-data request: sending and json and binary files
    if(contentType && contentType.includes('multipart/form-data')){
        // handle request containing uploaded files
        request = JSON.parse(req.body.post);    

        // More security check: compare account id with account id
        //  that was in token's payload
        const requestAccountId = request._id;
        if(!requestAccountId || requestAccountId !== tokenAccountId){
            return res.status(401).json({
                error: "Unauthorized request: account id missing in the request or provided id is invalid"
            });
        }

        // Return error if incomplete request
        if(!request.PostTitle || !request.PostContent){
            return res.status(400).json({
                error: "Incomplete post: Title or content is missing"
            });
        }
        
        
        const employeeAccount = await EmployeeAccount.findOne({
            where:{_id: tokenAccountId}
        });
        const EmployeeAccountID = employeeAccount.EmployeeAccountID;
        // create unique identifier to id each unique post
        const newPostId = uuidv4();
        // PostDate will be automatically populated with built-in "createdAt" feature
        const newPost = {
            PostTitle: request.PostTitle,
            PostContent: request.PostContent,
            EmployeeAccountID: EmployeeAccountID,
            _id: newPostId
        };

        // exclude pk field to prevent sequelize from trying to insert values in this field:
        // --> pk fields are handled internally by DB
        const post = await Posts.create(newPost, {fields: ['PostTitle', 'PostContent', '_id', 'PostDate', 'EmployeeAccountID']})
        
        // create media values for Media table
        const files = req.files;
        const videos = files.video || [];
        const gifs = files.gif || [];
        const images = files.image || [];
        
        const newMedias = [];
    
        videos.forEach(video =>{
            // normalize path
            let videoPath = video.path.replace(/\\+/g, '/');
            const newMedia={
                MediaType: video.fieldname,
                PostID: post.PostID,
                MediaUrl: process.env.BASE_UPLOAD_URL + videoPath
            }
            newMedias.push(newMedia);
        });
    
        gifs.forEach(gif =>{
            // normalize path
            let gifPath = gif.path.replace(/\\+/g, '/');
            const newMedia={
                MediaType: gif.fieldname,
                PostID: post.PostID,
                MediaUrl: process.env.BASE_UPLOAD_URL + gifPath
            }
            newMedias.push(newMedia);
        });
    
        images.forEach(image =>{
            // normalize path
            let imagePath = image.path.replace(/\\+/g, '/');
            const newMedia={
                MediaType: image.fieldname,
                PostID: post.PostID,
                MediaUrl: process.env.BASE_UPLOAD_URL + imagePath
            }
            newMedias.push(newMedia);
        });
    
        // bulkCreate all lines by an array of objects
        const medias = await Media.bulkCreate(newMedias, {fields: ['MediaType', 'PostID', 'MediaUrl']});
        // Here it's like ({MediaID, PostID, ...rest})=>{return rest}
        // --> implicit return

        
        const mediasToSend = medias.map(media =>({
            MediaType : media.dataValues.MediaType,
            MediaUrl : media.dataValues.MediaUrl
        }));

    
        // how to not resend the PKS
        res.status(201).json({
            message: 'Post successfully uploaded',
            post: {
                PostTitle: post.PostTitle,
                PostContent: post.PostContent,
                PostDate: post.PostDate,
                _id: post._id   
            },
            media: mediasToSend
        });
    // sending only json
    } else{
        // handle normal application/json request
        request = req.body;    

        // More security check: compare account id with account id
        //  that was in token's payload
        const requestAccountId = request._id;
        if(!requestAccountId || requestAccountId !== tokenAccountId){
            return res.status(401).json({
                error: "Unauthorized request: account id missing in the request or provided id is invalid"
            });
        }

        // Return error if incomplete request
        if(!request.PostTitle || !request.PostContent){
            return res.status(400).json({
                error: "Incomplete post: Title or content is missing"
            });
        }
        
        
        const employeeAccount = await EmployeeAccount.findOne({
            where:{_id: tokenAccountId}
        });
        const EmployeeAccountID = employeeAccount.EmployeeAccountID;
        // create unique identifier to id each unique post
        const newPostId = uuidv4();
        // PostDate will be automatically populated with built-in "createdAt" feature
        const newPost = {
            PostTitle: request.PostTitle,
            PostContent: request.PostContent,
            EmployeeAccountID: EmployeeAccountID,
            _id: newPostId
        };

        // exclude pk field to prevent sequelize from trying to insert values in this field:
        // --> pk fields are handled internally by DB
        const post = await Posts.create(newPost, {fields: ['PostTitle', 'PostContent', '_id', 'PostDate', 'EmployeeAccountID']});

        res.status(201).json({
            message: 'Post successfully uploaded',
            post: {
                PostTitle: post.PostTitle,
                PostContent: post.PostContent,
                PostDate: post.PostDate,
                _id: post._id
            }
        });
    }

   }catch(error){
 
    console.error("Unexpected error:", error);
    res.status(500).json({
        message: 'Internal server error',
        error: error.message || error
    });
   }
};

/**
 * Receives for Posts: nothing
 */
exports.getAllPosts = (req, res, next)=>{
    Posts.findAll({
        attributes: ['PostTitle', 'PostContent', 'PostDate','_id']
    })
    .then((posts)=>{
        if(!posts){
            return res.status(404).json({error: 'No posts in the database'});
        }
        res.status(200).json({
            message: 'Successfully retrieved all posts',
            posts
        });
    })
    .catch((error)=>{
        res.status(500).json({
            message: 'Internal server error',
            error: error.message || error
        });
    });
};

exports.getOnePost = (req, res, next)=>{
    const params = req.params;
};

exports.updateOnePost = (req, res, next)=>{

};

exports.deleteOnePost =async (req, res, next)=>{
    
};

exports.updateReaction = (req, res, next)=>{

};
