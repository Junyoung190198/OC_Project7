const express = require('express');
const router = express.Router();
const postsCtrl = require('../controllers/posts');

// create/upload a post
router.post('/', postsCtrl.createPost);
// display/get all posts from any employee (feed like 9gag or reddit)
router.get('/', postsCtrl.getAllPosts);
// display/get one unique post by id
router.get('/:id', postsCtrl.getOnePost);
// modify one post
router.put('/:id', postsCtrl.updateOnePost);
// delete one post
router.delete('/:id', postsCtrl.deleteOnePost);
// update/create like/dislike status
router.post('/:id/reactions', postsCtrl.updateReaction);


module.exports = router;

// amazon s3
// amazon cognito/amplify