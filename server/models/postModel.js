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
            hour: number,
            minute: number,
            second: number,
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
        required: [true, 'Please add a quiz title']
    },
    postedBy: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Post', postSchema);