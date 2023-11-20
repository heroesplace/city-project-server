const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    sender: "ObjectId",
    receiver: [{
        character_id: "ObjectId",
        status: Number, // 0 = en attente, 1 = acceptée, 2 = refusée
        date: Date
    }],
})

exports.InviteModel = mongoose.model('Invite', schema)