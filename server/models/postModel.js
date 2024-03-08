const mongoose = require('mongoose')

//schema
const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please add a title']
    },
    description: {
        type: String,
        required: [true, 'Please add a description']
    },
    images: [
        {
            type: String,
        },
    ],
    quizzes: [
        {
            hour: Number,
            minute: Number,
            second: Number,
            added: Boolean,
            questions: [
                {
                    question: String,
                    correct_answer: String,
                    incorrect_answers: [String],
                },
            ],
        }
    ],
    quizTitle: {
        type: String,
    },
    likes: {
        type: Number,
    },
    rating: {
        type: Number,
    },
    postType: {
        type: String,
        required: [true, 'Please add a post type']
    },
    postedBy: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Post', postSchema);