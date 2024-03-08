const mongoose = require('mongoose')

//schema
const quizSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please add a title']
    },
    description: {
        type: String,
        required: [true, 'Please add a description']
    },
    quizQuest: [
        {
            question: String,
            correct_answer: String,
            incorrect_answers: [String],
        }
    ],
    postType: {
        type: String,
        required: [true, 'Please add a post type']
    },
    likes: {
        type: Number,
    },
    rating: {
        type: Number,
    },
    postedBy: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Quiz', quizSchema, 'quizzes');