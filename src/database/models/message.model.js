const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    content: String,
    author: {
        type: "ObjectId",
        required: true
    }, // Character Object Id
    date: Date,
    channel: String
})

exports.MessageModel = mongoose.model('Message', schema)