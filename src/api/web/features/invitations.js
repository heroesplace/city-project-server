const mongodb = require('../../../database/index')
const mongoose = require('mongoose')
const moment = require('moment')

const { ErrorCode } = require('./errors')

const onInviteCharacter = (sender, receiver) => {
    sender = new mongoose.Types.ObjectId(sender)
    receiver = new mongoose.Types.ObjectId(receiver)

    return new Promise((resolve, reject) => {
        if (sender.toString() == receiver.toString()) {
            reject(new ErrorCode(400, "SELF_INVITE", "Cannot invite oneself"))
        } else {
            mongodb.models.Invitations.findOne({ sender: sender }).then((invitation) => {
                if (!invitation) {
                    mongodb.models.Invitations.collection.insertOne({
                        sender: sender,
                        receiver: [{ _id: new mongoose.mongo.ObjectId(), character_id: receiver, status: 0, date: new Date(moment().format()) }]
                    }).then(() => {
                        resolve(new ErrorCode(200, "SUCCESSFULLY_INVITED", "Character successfully invited."))
                    })
                } else {
                    let exists = false
    
                    for (const [_, value] of Object.entries(invitation.receiver)) {
                        let character_id = value.character_id

                        if (character_id.toString() == receiver) {
                            // socket.emit("server_alert", { message: "Vous avez déjà invité ce joueur !" })
                            reject(new ErrorCode(400, "ALREADY_INVITED", "Character already invited."))
                            exists = true
                        }
                    }
    
                    if (!exists) {
                        mongodb.models.Invitations.updateOne({ sender: sender }, { $push: { receiver: { character_id: receiver, status: 0, date: new Date(moment().format()) } } }).then(() => {
                            resolve(new ErrorCode(200, "SUCCESSFULLY_INVITED", "Character successfully invited."))
                        })
                    }
                }
            })
        }
    })
}

module.exports = {
    onInviteCharacter,
}