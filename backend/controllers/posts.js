const Posts = require('../models/posts');
const employeeAccount = require('../models/employeeAccount');
const {v4: uuidv4} = require('uuid');
const EmployeeAccount = require('../models/employeeAccount');


exports.createPost = async (req, res, next)=>{
   try{
    const contentType = req.get('Content-Type');
    let request;
    if(contentType.includes('multipart/form-data')){
        // handle request containing uploaded files
        request = JSON.parse(req.body.post);    
    } else{
        // handle normal application/json request
        request = req.body;    
    }
    
    // Return error if incomplete request
    if(!request.PostTitle || !request.PostContent){
        return res.status(400).json({
            error: "Incomplete post: Title or content is missing"
        });
    }
    
    const _id = req.EmployeeAccount._id;
    const employeeAccount = await EmployeeAccount.findOne({
        where:{_id: _id}
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
    res.status(201).json({
        message: 'Post successfully uploaded',
        post: {
            PostTitle: post.PostTitle,
            PostContent: post.PostContent,
            PostDate: post.PostDate,
            _id: post._id   
        }
    });

   }catch(error){
    res.status(500).json({
        error: error
    });
   }
};

exports.getAllPosts = (req, res, next)=>{
    Post.findAll({
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
