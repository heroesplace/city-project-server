const mongodb = require('../../../database')
const mongoose = require('mongoose')

const onPullMailbox = (socket, character_id) => {
    mongodb.models.Characters.findOne({ _id: character_id }).then((character) => {
        mongodb.models.Invites.find({ _id: { $in: character.invites }, 'receiver.status': 0 }).then((invites) => {
            socket.emit("update_character_mailbox", { mail_list: invites })
        })
    })
}

module.exports = {
    onPullMailbox,
}