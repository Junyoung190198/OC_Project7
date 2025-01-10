const express = require('express');
const router = express.Router();
const postsCtrl = require('../controllers/posts');
// confifured multer middleware to parse files if uploaded
const multer = require('../middleware/multer-config');
// authentification middleware with web token verification
const authentification = require('../middleware/authentification');

// create a post
router.post('/', authentification, multer, postsCtrl.createPost);
// display/get all posts from any employee (feed like 9gag or reddit)
router.get('/', postsCtrl.getAllPosts);
// display/get one unique post by id
router.get('/:id', postsCtrl.getOnePost);
// modify one post
router.put('/:id', authentification, multer, postsCtrl.updateOnePost);
// delete one post
router.delete('/:id', authentification, postsCtrl.deleteOnePost);
// update/create like/dislike status
router.post('/:id/reactions', authentification, postsCtrl.updateReaction);
// check if the user created the post
router.get('/:id/check', authentification, postsCtrl.checkAccountPost);
// update isRead status
router.post('/:id/isRead', authentification, postsCtrl.updateIsRead);

module.exports = router;

// amazon s3
// amazon cognito/amplify