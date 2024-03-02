const postModel = require("../models/postModel");

//create new post
const createPostController = async (req, res) => {
    try {
        const { title, description, images, quizzes, quizTitle } = req.body;

        //validate
        if (!title || !description || !images || !images.length || !quizTitle) {
            return res.status(400).send({
                success: false,
                message: 'Please fill all fields and provide at least one Image or Video',
            });
        }

        const post = await postModel({ title, description, images, quizzes, quizTitle, postedBy: req.auth._id }).save();

        res.status(201).send({
            success: true,
            message: "Post created successfully",
            post
        })
    }
    catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: "Error creating post",
            error
        })
    }
};

//get all posts
const getAllPostsController = async (req, res) => {
    try {
        const posts = await postModel
            .find()
            .populate('postedBy', "_id username")
            .sort({ createdAt: -1 });

        res.status(200).send({
            success: true,
            message: "All posts data",
            posts,
        })
    }
    catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error getting posts api",
            error
        })
    }
};

//get users posts
const getUsersPostsController = async (req, res) => {
    try {
        const userPosts = await postModel.findOne({ postedBy: req.auth._id });
        res.status(200).send({
            success: true,
            message: "UsersPosts",
            userPosts
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).send({
            success: false,
            message: "Error getting users posts api",
            error
        });
    }
}

//delete post
const deletePostController = async (req, res) => {
    try {
        const { id } = req.params;
        await postModel.findByIdAndDelete({ _id: id });
        res.status(200).send({
            success: true,
            message: "Post deleted successfully!",
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).send({
            success: false,
            message: "Error in delete posts api",
            error
        });
    }
}

//update post
const updatePostController = async (req, res) => {
    try {
        const { title, description } = req.body;
        //find post
        const post = await postModel.findById({ _id: req.params.id });

        //validation
        if (!title || !description) {
            return res.status(500).send({
                success: false,
                message: "Please provide post title and description"
            });
        }
        const updatedPost = await postModel.findByIdAndUpdate({ _id: req.params.id }, {
            title: title || post?.title,
            description: description || post?.description
        }, { new: true });

        res.status(200).send({
            success: true,
            message: "Post updated successfully!",
            updatedPost,
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).send({
            success: false,
            message: "Error in update posts api",
            error
        });
    }
}

module.exports = { createPostController, getAllPostsController, getUsersPostsController, deletePostController, updatePostController };