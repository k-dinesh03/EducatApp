const express = require('express');
const { requireSignIn } = require('../controllers/userController');
const {
    createPostController,
    getAllPostsController,
    getUsersPostsController,
    deletePostController,
    deleteQuizController,
    updatePostController,
    createQuizPostController,
    getAllQuizController
} = require('../controllers/postController');

//router object
const router = express.Router();

//create post || post
router.post('/create-post', requireSignIn, createPostController);

//create quiz
router.post('/create-quiz', requireSignIn, createQuizPostController);

//get all posts
router.get('/get-posts', getAllPostsController);

//get all quizzes
router.get('/get-quizzes', getAllQuizController);

//get user posts
router.get('/get-user-posts', requireSignIn, getUsersPostsController);

//delete post
router.delete('/delete-post/:id', requireSignIn, deletePostController);

//delete quiz post
router.delete('/quiz/delete-post/:id', requireSignIn, deleteQuizController);

// update post
router.put('/update-post/:id', requireSignIn, updatePostController);

//export
module.exports = router;
