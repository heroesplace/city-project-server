const mongodb = require('../../../database/index')
const mongoose = require('mongoose')
const moment = require('moment')

const { ErrorCode } = require('./errors')

const transaction = async (sender, receiver, already_exists) => {
    const session = await mongoose.startSession()
    session.startTransaction()

    let id

    try {
        if (!already_exists) {
            let new_invite = await mongodb.models.Invites.collection.insertOne({
                sender: sender,
                receiver: [{ _id: new mongoose.mongo.ObjectId(), character_id: receiver, status: 0, date: new Date(moment().format())
                }]
            }, { session: session })
            id = new_invite.insertedId
        } else {
            let exists = false

            for (const [_, value] of Object.entries(invite.receiver)) {
                let character_id = value.character_id

                if (character_id.toString() == receiver) {
                    // socket.emit("server_alert", { message: "Vous avez déjà invité ce joueur !" })
                    reject(new ErrorCode(400, "ALREADY_INVITED", "Character already invited."))
                    exists = true
                }
            }

            if (!exists) {
                let updated_invite = mongodb.models.Invites.updateOne({ sender: sender }, { $push: { receiver: { character_id: receiver, status: 0, date: new Date(moment().format()) } } }, { session: session })
                id = updated_invite.upsertedId 
            }
        }
        
        await mongodb.models.Characters.collection.updateOne({ _id: receiver }, { $push: { invites: id } }, { session: session })

        await session.commitTransaction()
        session.endSession()
    } catch (error) {
        await session.abortTransaction()
        session.endSession()
        throw error
    }
}

const onInviteCharacter = (sender, receiver) => {
    sender = new mongoose.Types.ObjectId(sender)
    receiver = new mongoose.Types.ObjectId(receiver)

    return new Promise((resolve, reject) => {
        if (sender.toString() == receiver.toString()) {
            reject(new ErrorCode(400, "SELF_INVITE", "Cannot invite oneself"))
        } else {
            mongodb.models.Invites.findOne({ sender: sender }).then((invite) => {
                transaction(sender, receiver, invite)
            })
        }
    })
}

module.exports = {
    onInviteCharacter,
}