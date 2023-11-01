const mongodb = require('../../../database')
const mongoose = require('mongoose')

const onReplyToInvitation = (io, socket, sender, answer) => {
    mongodb.models.Invitations.findOne({ sender: sender }).then((invitation) => {
        let result = []

        for (const [_, value] of Object.entries(invitation.receiver)) {
            let character_id = value.character_id

            if (character_id.toString() == socket.character_id.toString() && value.status == 0) {
                value.status = answer ? 1 : 2
            }

            result.push(value)
        }

        mongodb.models.Invitations.updateOne({ sender: sender }, { $set: { receiver: result } }).then(() => {
            // TODO: Send notification to sender
        })
    })
}

module.exports = {
    onReplyToInvitation,
}