const postModel = require("../models/postModel");

//create post
const createPostController = async (req, res) => {
    try {
        const { title, subtitle, description } = req.body;

        //validate
        if (!title || !subtitle || !description) {
            return res.status(500).send({
                success: false,
                message: "Please fill all fields"
            })
        }

        const post = await postModel({ title, subtitle, description, postedBy: req.auth._id }).save();

        res.status(201).send({
            success: true,
            message: "Post created successfully",
            post
        })
        console.log(req)
    }
    catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: "Error creating post",
            error
        })
    }
}

module.exports = { createPostController };