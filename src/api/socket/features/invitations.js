const mongodb = require('../../../database')
const mongoose = require('mongoose')

const onReplyToInvitation = (socket, answer) => {
    mongodb.models.Invitations.findOne({ _id: socket.account_id }).then((account) => {

    })
}

const onSendInvitation = (socket, receiver) => {
    mongodb.models.Characters.findOne({ $or: [{ property: { $exists: false } }, { property: { $eq: '' } }], character_name: receiver.toLowerCase() }).then((character) => {
        mongodb.models.Invitations.findOne({ sender: socket.character_id }).then((invitation) => {
            if (!invitation) {
                mongodb.models.Invitations.collection.insertOne({
                    sender: socket.character_id,
                    receiver: [{_id: new mongoose.mongo.ObjectId() , character: character._id, status: 0, date: Date.now()}]
                }).then(() => {
                    console.log('Invitation envoyée avec succès.')
                })
            } else {
                let exists = false

                for (const [_, value] of Object.entries(invitation.receiver)) {
                    let character_id = value.character
        
                    if (character_id.toString() == character._id.toString()) {
                        console.log("Invitation already sent !")
                        exists = true
                    }
                }

                if (!exists) {
                    mongodb.models.Invitations.updateOne({ sender: socket.character_id }, { $push: { receiver: {character: character._id, status: 0, date: Date.now()} } }).then(() => {
                        console.log('Invitation envoyée avec succès.')
                    })
                }
            }
        })
    })
}

module.exports = {
    onReplyToInvitation,
    onSendInvitation
}