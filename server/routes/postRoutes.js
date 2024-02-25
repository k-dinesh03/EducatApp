const express = require('express');
const { requireSignIn } = require('../controllers/userController');
const {
    createPostController,
    getAllPostsController,
    getUsersPostsController,
    deletePostController,
    updatePostController
} = require('../controllers/postController');

//router object
const router = express.Router();

//create post || post
router.post('/create-post', requireSignIn, createPostController);

//get all posts
router.get('/get-posts', getAllPostsController);

//get user posts
router.get('/get-user-posts', requireSignIn, getUsersPostsController);

//delete post
router.delete('/delete-post/:id', requireSignIn, deletePostController);

// update post
router.put('/update-post/:id', requireSignIn, updatePostController);

//export
module.exports = router;
