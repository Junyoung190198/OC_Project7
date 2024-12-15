const Post = require('../models/posts');
const employeeAccount = require('../models/employeeAccount');
const {v4: uuidv4} = require('uuid');


exports.createPost = (req, res, next)=>{

    

    const contentType = req.get('Content-Type');
    let request;

    if(contentType.includes('multipart/form-data')){
        // handle request containing uploaded files
        request = JSON.parse(req.body.post);
    } else{
        // handle normal application/json request
        request = req.body;
    }
    
    if(!request.PostTitle || !request.PostContent){
        return res.status(400).json({error: new Error('Post has no title or no content')});
    }

    // create unique identifier to id each unique post
    const newPostId = uuidv4();
    // PostDate will be automatically populated with built-in "createdAt" feature
    const newPost = {
        PostTitle: request.PostTitle,
        PostContent: request.PostContent,
        _id: newPostId
    };

    Post.create(newPost)
    .then((createdPost)=>{
        




        res.status(201).json({
            message: 'Post successfully uploaded',
            post:{
                PostTitle: createdPost.PostTitle,
                PostContent: createdPost.PostContent,
                PostDate: createdPost.createdAt,
                _id: createdPost._id
            }
        });
        // code to execute 

    })
    .catch((error)=>{
        res.status(500).json(error);
    });

   
};

exports.getAllPosts = (req, res, next)=>{
    Post.findAll({
        attributes: ['PostTitle', 'PostContent', 'PostDate','_id']
    })
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
    const params = req.params;
};

exports.updateOnePost = (req, res, next)=>{

};

exports.deleteOnePost =async (req, res, next)=>{

    
};

exports.updateReaction = (req, res, next)=>{

};
