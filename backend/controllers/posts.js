const Posts = require('../models/posts');
const EmployeeAccount = require('../models/employeeAccount');
const Media = require('../models/media');
const {v4: uuidv4} = require('uuid');
const path = require('path');
const { where } = require('sequelize');
require('dotenv').config({path: path.resolve(__dirname, '../.env')});


/**
 * Receives for authentification: EmployeeAccount._id
 * Receives for Posts: PostTitle, PostContent.
 * if uploading files, receives files for Posts
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
        const requestAccountId = request.account_id;
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
        console.log(post);
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
                PostTitle: post.dataValues.PostTitle,
                PostContent: post.dataValues.PostContent,
                PostDate: post.dataValues.PostDate,
                _id: post.dataValues._id   
            },
            media: mediasToSend
        });
    // sending only json
    } else{
        // handle normal application/json request
        request = req.body;    

        // More security check: compare account id with account id
        //  that was in token's payload
        const requestAccountId = request.account_id;
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
                PostTitle: post.dataValues.PostTitle,
                PostContent: post.dataValues.PostContent,
                PostDate: post.dataValues.PostDate,
                _id: post.dataValues._id   
            },
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
            posts: posts
        });
    })
    .catch((error)=>{
        res.status(500).json({
            message: 'Internal server error',
            error: error.message || error
        });
    });
};


/**
 * Receives for Posts: Posts._id contained in req.params
 * No authentification needed 
 */
exports.getOnePost = async (req, res, next)=>{
    try{
        // extract post's id from url
        const params = req.params;
        const _id = params.id;
        // specify attributes to return only fields we need to send
        // to the front
        const post = await Posts.findOne({
            where:{_id: _id},
            attributes: ['PostTitle', 'PostContent', 'PostDate', '_id']
        });
        if(!post){
            return res.status(404).json({
                error: "Post doesn't exist"
            });
        }

        res.status(200).json({
            message: 'Successful retrieved this post',
            post: post
        });

    }catch(error){
        res.status(500).json({
            message: 'Internal server error',
            error: error.message || error
        });
    }
};


/**
 * Receives for authentification: EmployeeAccount._id
 * Receives for Posts : Posts._id
 * Receives for Posts if updating: PostTitle or PostContent
 * Receives for Media if also updating files: MediaUrl  
 */
exports.updateOnePost = async (req, res, next)=>{
    try{
        const params = req.params;
        const post_id = params.id;
        const contentType = req.get('Content-Type');
        let request;
        const tokenAccountId = req.tokenPayload._id;
        if(contentType && contentType.includes('multipart/form-data')){
            request = JSON.parse(req.body.post);

            const requestAccountId = request.account_id;
            if(!requestAccountId || requestAccountId !== tokenAccountId){
                return res.status(401).json({
                    error: "Unauthorized request: account id missing in the request or provided id is invalid"
                });
            }
            
            if(!request.PostTitle && !request.PostContent && req.files){
                return res.status(400).json({
                    error: "Incomplete post: At least one of the following is needed: PostTitle, PostContent, file"
                });
            }

            const newPost = {
                PostTitle: request.PostTitle,
                PostContent: request.PostContent
            };

            await Posts.update(newPost, {
                where:{
                    _id: post_id
                },
                fields: ['PostTitle', 'PostContent']
            });

             // extract PostID to find related media in Media table
             // and extract updated post because the update method
             // doesn't return the updated object
             const updatedPost = await Posts.findOne({
                where: {
                    _id: post_id
                }
            });
            const postPk = updatedPost.PostID;

            // extract media arrays
            const files = req.files;
            const videos = files.video || [];
            const gifs = files.gif || [];
            const images = files.image || [];

            const newMedias = [];
            videos.forEach(video =>{
                let videoPath = video.path.replace(/\\+/g, '/');
                const newMedia = {
                    MediaType: video.fieldname,
                    PostID: updatedPost.PostID,
                    MediaUrl: process.env.BASE_UPLOAD_URL + videoPath
                };
                newMedias.push(newMedia);
            });
            gifs.forEach(gif =>{
                let gifPath = gif.path.replace(/\\+/g, '/');
                const newMedia={
                    MediaType: gif.fieldname,
                    PostID: updatedPost.PostID,
                    MediaUrl: process.env.BASE_UPLOAD_URL + gifPath
                };
                newMedias.push(newMedia);
            });
            images.forEach(image =>{
                let imagePath = image.path.replace(/\\+/g, '/');
                const newMedia={
                    MediaType: image.fieldname,
                    PostID: updatedPost.PostID,
                    MediaUrl: process.env.BASE_UPLOAD_URL + imagePath
                };
                newMedias.push(newMedia);
            });

            // Instead of using update method, first remove existing
            // data and recreate them with bulkCreate to insert several
            // lines at once           
            await Media.destroy({
                where:{
                    PostID: postPk
                }
            });
            await Media.bulkCreate(newMedias, {
                fields: ['MediaType', 'MediaUrl', 'PostID']
            });

            // retrieve updated lines in Media table at once
            const updatedMedias = await Media.findAll({
                where: {
                    PostID: postPk
                },
                attributes: ['MediaType', 'MediaUrl']
            });

            res.status(201).json({
                message: 'Post successfully updated',
                post: {
                    PostTitle: updatedPost.PostTitle,
                    PostContent: updatedPost.PostContent,
                    PostDate: updatedPost.PostDate,
                    _id: updatedPost._id
                },
                media: updatedMedias
            });
        }else{
            request = req.body;

            const requestAccountId = request.account_id;
            if(!requestAccountId || requestAccountId !== tokenAccountId){
                return res.status(401).json({
                    error: "Unauthorized request: account id missing in the request or provided id is invalid"
                });
            }

            if(!request.PostTitle && !request.PostContent){
                return res.status(400).json({
                    error: "Incomplete post: At least one of the following is needed: PostTitle, PostContent, file"
                });
            }

            const newPost ={
                PostTitle: request.PostTitle,
                PostContent: request.PostContent
            };

            await Posts.update(newPost, {
                where:{
                    _id: post_id
                },
                fields: ['PostTitle', 'PostContent']
            });
            const updatedPost = await Posts.findOne({
                where:{
                    _id: post_id
                },
                attributes: ['PostTitle', 'PostContent', 'PostDate', '_id']
            });

            res.status(201).json({
                message: 'Post successfully updated',
                post: updatedPost
            }); 
        }
    }catch(error){
        console.error(error);
        res.status(500).json({
            message: "Internal server error",
            error: error.message || error
        });
    }
};

exports.deleteOnePost =async (req, res, next)=>{
    
};

exports.updateReaction = (req, res, next)=>{

};
