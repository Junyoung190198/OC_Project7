const Posts = require('../models/posts');
const EmployeeAccount = require('../models/employeeAccount');
const Media = require('../models/media');
const Reactions = require('../models/reactions');
const MarkAsRead = require('../models/markAsRead');
const {Sequelize} = require('sequelize');

const {v4: uuidv4} = require('uuid');

const path = require('path');
require('dotenv').config({path: path.resolve(__dirname, '../.env')});
const fs = require('fs');



/**
 * Function to delete files asynchronously
 */

const deleteFiles = (existingFiles) => {
    return new Promise((resolve, reject) => {
        const deleteFilePromises = existingFiles.map(file => {
            return new Promise((resolve, reject) => {
                fs.unlink('uploads/' + file, (err) => {
                    if (err) {
                        console.error(`Error deleting file: ${file}`, err);
                        reject(err);  // Reject the promise on error
                    } else {
                        console.log(`Deleted file: ${file}`);
                        resolve();  // Resolve the promise when the file is successfully deleted
                    }
                });
            });
        });

        // Wait for all delete operations to finish
        Promise.all(deleteFilePromises)
            .then(resolve)  // Resolve the outer promise when all files are deleted
            .catch(reject);  // Reject the outer promise if any file deletion fails
    });
};


/**
 * function to check if ids match for every request 
 * that need a authentification:
 * More security check: compare account id with account id
 * that was in token's payload
 */
const checkUnauthorizedRequest = (request, reqTokenPayload)=>{
    // extracting _id passed by authentification middleware
    // that was decoded in the token
    const tokenAccountId = reqTokenPayload._id;
    const requestAccountId = request.account_id;
            if(!requestAccountId || requestAccountId !== tokenAccountId){        
                throw new Error("Unauthorized request: account id missing in the request or provided id is invalid")
            }        
}


/**
 * Receives for authentification: EmployeeAccount._id
 * Receives for Posts: PostTitle, PostContent.
 * if uploading files, receives files for Posts
 */
exports.createPost = async (req, res, next)=>{
   try{
    const contentType = req.get('Content-Type');
    let request;
    const reqTokenPayload = req.tokenPayload;
    // if it's a form-data request: sending and json and binary files
    if(contentType && contentType.includes('multipart/form-data')){
        // handle request containing uploaded files
        request = JSON.parse(req.body.post);    

        try{
            checkUnauthorizedRequest(request, reqTokenPayload);
        }catch(error){
            return res.status(401).json({
                error: error.message
            });
        }
        
        // Return error if incomplete request
        if(!request.PostTitle || !request.PostContent){
            return res.status(400).json({
                error: "Incomplete post: Title or content is missing"
            });
        }
        
        
        const employeeAccount = await EmployeeAccount.findOne({
            where:{_id: reqTokenPayload._id}
        });
        const EmployeeAccountID = employeeAccount.EmployeeAccountID;
        // create unique identifier to id each unique post
        const newPostId = uuidv4();
        // CreatedAt will be automatically populated with built-in "createdAt" feature
        const newPost = {
            PostTitle: request.PostTitle,
            PostContent: request.PostContent,
            EmployeeAccountID: EmployeeAccountID,
            _id: newPostId
        };

        // exclude pk field to prevent sequelize from trying to insert values in this field:
        // --> pk fields are handled internally by DB
        const post = await Posts.create(newPost, {fields: ['PostTitle', 'PostContent', '_id', 'CreatedAt', 'EmployeeAccountID']});
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


        
        res.status(201).json({
            message: 'Post successfully uploaded',
            post: {
                PostTitle: post.dataValues.PostTitle,
                PostContent: post.dataValues.PostContent,
                CreatedAt: post.dataValues.CreatedAt,
                _id: post.dataValues._id   
            },
            media: mediasToSend
        });
    // sending only json
    } else{
        // handle normal application/json request
        request = req.body;    

        try{
            checkUnauthorizedRequest(request, reqTokenPayload);
        }catch(error){
            return res.status(401).json({
                error: error.message
            });
        }

        // Return error if incomplete request
        if(!request.PostTitle || !request.PostContent){
            return res.status(400).json({
                error: "Incomplete post: Title or content is missing"
            });
        }
        
        
        const employeeAccount = await EmployeeAccount.findOne({
            where:{_id: reqTokenPayload._id}
        });
        const EmployeeAccountID = employeeAccount.EmployeeAccountID;
        // create unique identifier to id each unique post
        const newPostId = uuidv4();
        // CreatedAt will be automatically populated with built-in "createdAt" feature
        const newPost = {
            PostTitle: request.PostTitle,
            PostContent: request.PostContent,
            EmployeeAccountID: EmployeeAccountID,
            _id: newPostId
        };

        // exclude pk field to prevent sequelize from trying to insert values in this field:
        // --> pk fields are handled internally by DB
        const post = await Posts.create(newPost, {fields: ['PostTitle', 'PostContent', '_id', 'CreatedAt', 'EmployeeAccountID']});

        res.status(201).json({
            message: 'Post successfully uploaded',
            post: {
                PostTitle: post.dataValues.PostTitle,
                PostContent: post.dataValues.PostContent,
                CreatedAt: post.dataValues.CreatedAt,
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
 * Make a join sql query to retrieve and Posts table's
 * data and Media table's data
 */
exports.getAllPosts = async (req, res, next)=>{
    try{
        const posts = await Posts.findAll({
            attributes: ['PostTitle', 'PostContent', 'CreatedAt','_id'],
            include: [
                {
                    model: Media,
                    as: 'media',
                    attributes: ['MediaType', 'MediaUrl']
                }
            ]
        })
        if(!posts || posts.length === 0){
            return res.status(404).json({error: 'No posts in the database'});
        }

        res.status(200).json({
            message: 'Successfully retrieved all posts',
            posts: posts
        });

    }catch(error){
        res.status(500).json({
            message: 'Internal server error',
            error: error.message || error
        });
    }   
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
            attributes: ['PostTitle', 'PostContent', 'CreatedAt', '_id'],
            include: [
                {
                    model: Media,
                    as: 'media',
                    attributes: ['MediaType', 'MediaUrl']
                }
            ]
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
        const reqTokenPayload = req.tokenPayload;
        
        if(contentType && contentType.includes('multipart/form-data')){
            request = JSON.parse(req.body.post);

            try{
                checkUnauthorizedRequest(request, reqTokenPayload);
            }catch(error){
                return res.status(401).json({
                    error: error.message
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
            // Logic to reflect updates in the storage: 
            // delete all files corresponding to the post
            // and save updated files

            // Extract MediaUrl of all existing files for this post
            const existingMedias = await Media.findAll({
                where:{
                    PostID: postPk
                },
                attributes: ['MediaUrl']
            });
            // Extract filename of existing files to delete them
            const existingFiles = existingMedias.map(media => media.MediaUrl.split('/uploads/')[1]);
            await deleteFiles(existingFiles);

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

            try{
                checkUnauthorizedRequest(request, reqTokenPayload);
            }catch(error){
                return res.status(401).json({
                    error: error.message
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
                attributes: ['PostTitle', 'PostContent', 'CreatedAt', '_id']
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

/**
 * Receives for EmployeeAccount: EmployeeAccount's id
 * Receives for Posts: Post's id in params
 */
exports.deleteOnePost = async (req, res, next)=>{
    try{
        const params = req.params;
        const post_id = params.id;
        const request = req.body;
        const reqTokenPayload = req.tokenPayload;

        try{
            checkUnauthorizedRequest(request, reqTokenPayload);
        }catch(error){
            return res.status(401).json({
                error: error.message
            });
        }

        const post = await Posts.findOne({
            where:{
                _id: post_id
            }
        });
        if(!post){
            return res.status(404).json({
                error: "This post doesn't exist or is already deleted"
            });
        }
        const postPk = post.PostID;

        const media = await Media.findAll({
            where:{
                PostID: postPk
            },
            attributes: ['MediaUrl']
        });
        
        if(media){
            const files = media.map(media=> media.MediaUrl.split('/uploads/')[1]);
            await deleteFiles(files);

            await Media.destroy({
                where:{
                    PostID: postPk
                }
            });
        }

        await Posts.destroy({
            where:{
                PostID: postPk
            }
        });

        res.status(200).json({
            message: 'Post successfully deleted'
        });

    }catch(error){
        console.error(error);
        res.status(500).json({
            message: 'Internal server error',
            error: error.message || error
        });
    }
};

/**
 * Receives for Posts: Post's id, ReactionType 
 * --> 1 if like, 0 if nothing and -1 if dislike
 * Receives for Reactions: EmployeeAccount's _id, Post's id, ReactionType  
 * --> 1 if like, 0 if nothing and -1 if dislike, 
 */
exports.updateReaction = async (req, res, next) => {
    try {
        const request = req.body;
        const reactionType = parseInt(request.ReactionType, 10);
        const reqTokenPayload = req.tokenPayload;
        const params = req.params;
        const postId = params.id;
        let totalLikes = 0;
        let totalDislikes = 0;
        let isUpdated = false;

        // Check if the reactionType is valid
        if (![1, 0, -1].includes(reactionType)) {
            return res.status(400).json({
                error: "Invalid reactionType. Accepted values are 1 (like), 0 (none), and -1 (dislike)"
            });
        }

        // Extract post from the database
        const post = await Posts.findOne({
            where: {
                _id: postId
            }
        });
        if (!post) {
            return res.status(404).json({
                error: "This post doesn't exist"
            });
        }

        // Extract employee account from token
        const employeeAccount = await EmployeeAccount.findOne({
            where: {
                _id: reqTokenPayload._id
            }
        });

        const postPk = post.PostID;
        const employeeAccountPk = employeeAccount.EmployeeAccountID;

        // Check if the user has already reacted to the post
        const existingReaction = await Reactions.findOne({
            where: {
                EmployeeAccountID: employeeAccountPk,
                PostID: postPk
            }
        });

        // If the reaction already exists and the type is the same, do nothing
        if (existingReaction && existingReaction.ReactionType === reactionType) {
            return res.status(200).json({
                message: "Your reaction is already recorded."
            });
        }

        // If the reaction exists but is different, update it
        if (existingReaction) {
            await Reactions.update(
                {
                    ReactionType: reactionType,
                    CreatedAt: Sequelize.fn('GETDATE')
                },
                {
                    where: {
                        EmployeeAccountID: employeeAccountPk,
                        PostID: postPk
                    }
                });

            // Adjust the like/dislike counters based on the old and new reaction
            if (existingReaction.ReactionType === 1 && (reactionType === 0 || reactionType === -1)) {
                totalLikes -= 1;
                if (reactionType === -1) totalDislikes += 1;
            } else if (existingReaction.ReactionType === 0 && reactionType === 1) {
                totalLikes += 1;
            } else if (existingReaction.ReactionType === 0 && reactionType === -1) {
                totalDislikes += 1;
            } else if (existingReaction.ReactionType === -1 && (reactionType === 0 || reactionType === 1)) {
                totalDislikes -= 1;
                if (reactionType === 1) totalLikes += 1;
            }

            isUpdated = true;
        } else {
            // If the reaction does not exist, create it
            const newReaction = {
                EmployeeAccountID: employeeAccountPk,
                PostID: postPk,
                ReactionType: reactionType,
                CreatedAt: Sequelize.fn('GETDATE')
            };
            await Reactions.create(newReaction, {
                fields: ['EmployeeAccountID', 'PostID', 'ReactionType', 'CreatedAt']
            });

            if (reactionType === 1) {
                totalLikes += 1;
            } else if (reactionType === -1) {
                totalDislikes += 1;
            }

            isUpdated = false;
        }

        // Update total likes and dislikes on the post
        await Posts.increment(
            {
                totalLikes: totalLikes,
                TotalDislikes: totalDislikes
            },
            {
                where: {
                    PostID: postPk
                }
            }
        );

        // Respond with the updated post details
        const updatedPost = await Posts.findByPk(postPk, {
            attributes: ['PostTitle', 'PostContent', '_id', 'CreatedAt', 'TotalLikes', 'TotalDislikes']
        });

        if (isUpdated) {
            return res.status(200).json({
                message: "Post's reaction successfully updated",
                post: updatedPost
            });
        } else {
            return res.status(201).json({
                message: "Post's reaction successfully created",
                post: updatedPost
            });
        }

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: 'Internal server error',
            error: error.message || error
        });
    }
};

exports.checkAccountPost = async (req, res, next) => {
    try {
        const { id: postUuid } = req.params; // Post's UUID (_id) from the route parameter
        const accountUuid = req.tokenPayload._id; // Account's UUID (_id) from the token payload

        // Retrieve PostID and EmployeeAccountID from Posts table using postUuid
        const post = await Posts.findOne({
            where: { _id: postUuid },
            attributes: ['PostID', 'EmployeeAccountID'], // Only fetch what is needed
        });

        if (!post) {
            return res.status(404).json({ error: "Post not found." });
        }

        const { PostID, EmployeeAccountID: postOwnerAccountId } = post;

        // Retrieve EmployeeAccountID from EmployeeAccount table using accountUuid
        const account = await EmployeeAccount.findOne({
            where: { _id: accountUuid },
            attributes: ['EmployeeAccountID'], // Only fetch EmployeeAccountID
        });

        if (!account) {
            return res.status(404).json({ error: "Account not found." });
        }

        const { EmployeeAccountID: requesterAccountId } = account;

        // Compare Post's EmployeeAccountID with requester's EmployeeAccountID
        if (postOwnerAccountId === requesterAccountId) {
            return res.status(200).json({
                message: "User is the creator of the post.",
                isCreator: true,
            });
        } else {
            return res.status(403).json({
                message: "User is not the creator of the post.",
                isCreator: false,
            });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Internal server error",
            error: error.message || error,
        });
    }
};

/**
 * Receives MarkAsRead post's _id in params, account's id 
 * in authentification middleware and isRead
 * --> 1 if read, 0 if not read. Default is 0
 */
exports.updateIsRead = async (req, res, next)=>{
    try{
        const request = req.body;
        const reqTokenPayload = req.tokenPayload;
        const accountId = reqTokenPayload._id;
        const params = req.params;
        const postId = params.id;
        const isRead = parseInt(request.isRead, 10);

        // Check if the isRead value is valid
        if(![1,0].includes(isRead)){
            return res.status(400).json({
                error: 'Invalid isRead type. Accepted values or 1 and 0'
            });
        }

        const post = await Posts.findOne({
            where:{
                _id: postId
            }
        });
        const employeeAccount = await EmployeeAccount.findOne({
            where:{
                _id: accountId
            }
        });

        // extracting PKs
        const postID = post.PostID;
        const employeeAccountID = employeeAccount.EmployeeAccountID;

        // Check if this account alread read this post
        const existingIsRead = await MarkAsRead.findOne({
            where:{
                PostID: postID,
                EmployeeAccountID: employeeAccountID
            }
        });
        // If the status already exist for this account and this post
        if(existingIsRead){
            existingIsRead.isRead = isRead;
            await existingIsRead.save();
        }else{
            await MarkAsRead.create({
                PostID: postID,
                EmployeeAccountID: employeeAccountID,
                isRead: isRead
            });
        }

        res.status(200).json({
            message: 'Successfully created or updated isRead status'
        });

    }catch(error){
        console.error(error)
        res.status(500).json({
            message: 'Internal server error',
            error: error.message || error
        });
    }
};