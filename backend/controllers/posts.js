const {sequelize} = require('../config/database');
const Post = require('../models/posts');
const Credentials = require('../models/credentials');


exports.createPost = (req, res, next)=>{
    const contentType = req.get('Content-Type');
    const request = req.body;
    if(contentType.includes('multipart/form-data')){
        // handle request containing uploaded files
        
    }else{
        // handle normal json request
    }
};

exports.getAllPosts = (req, res, next)=>{
    Post.findAll()
    .then((posts)=>{
        if(!posts){
            return res.status(404).json({message: 'No posts in the database'});
        }
        res.status(200).json({
            message: 'Successfully retrieved all posts',
            posts
        });
    })
    .catch((error)=>{
        res.status(500).json({
            message: 'Internal server error',
            error: error
        });
    });
};

exports.getOnePost = (req, res, next)=>{

};

exports.updateOnePost = (req, res, next)=>{

};

exports.deleteOnePost =async (req, res, next)=>{

    
};

exports.updateReaction = (req, res, next)=>{

};
