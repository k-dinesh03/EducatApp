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
            hour: String,
            minute: String,
            second: String,
            added: Boolean,
            questions: [
                String, // type
                String, // difficulty
                String, // category
                String, // question
                String, // correct_answer
                [String], // incorrect_answers
            ],
        },
    ],
    postedBy: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Post', postSchema);