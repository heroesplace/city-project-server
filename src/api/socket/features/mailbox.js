const mongodb = require('../../../database')

const { getCharacterNameFromId } = require('../../../character')

const pullMailBox = async (socket, character_id) => {
    const character = await mongodb.models.Character.findOne({ _id: character_id })
    let invites = await mongodb.models.Invite.find({ _id: { $in: character.invites }, 'receiver.status': 0 })

    for (let i = 0; i < invites.length; i++) {
        let value = invites[i]

        invites[i] = {
            _id: value._id,
            sender: {
                _id: value.sender,
                character_name: await getCharacterNameFromId(value.sender)
            },
            type: "invite"
        }
    }

    socket.emit("update_character_mailbox", { mail_list: invites })
}

module.exports = {
    pullMailBox,
}