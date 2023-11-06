const mongodb = require('../../../database')
const mongoose = require('mongoose')

const isAlreadyInvited = (sender, receiver) => {
    return mongodb.models.Invitations.findOne({ sender: sender }).then((invitation) => {
        if (invitation) {
            for (const [_, value] of Object.entries(invitation.receiver)) {
                if (value.character_id.toString() == receiver.toString()) {
                    return true
                }
            }
        }

        return false
    })
}

const onReplyToInvitation = (io, socket, sender, answer) => {
    console.log("ici")
    mongodb.models.Invitations.findOne({ sender: sender }).then((invitation) => {
        if (!invitation) return
        
        console.log("ici 1")

        let result = []

        for (const [_, value] of Object.entries(invitation.receiver)) {
            let character_id = value.character_id

            if (character_id.toString() == socket.character_id.toString() && value.status == 0) {
                value.status = answer ? 1 : 2
            }

            result.push(value)
        }

        mongodb.models.Invitations.updateOne({ sender: sender }, { $set: { receiver: result } }).then(() => {
            updateInvitationList(io, sender)
        })

    })
}

const updateInvitationList = (io, sender) => {
    console.log(sender)
    mongodb.models.Invitations.findOne({ sender: sender }).then((invitation) => {
        if (!invitation) return
        
        let invitation_member_list = invitation.receiver

        // TODO: Send notification to sender
        mongodb.models.Characters.find({ _id: { $in: invitation_member_list.map((value) => value.character_id) } }).select("character_name").then((characters) => {

            // Créez un objet de correspondance entre les caractères et leurs noms
            let characterMap = {}
            characters.forEach(character => {
                characterMap[character._id] = character.character_name
            })

            // Fusionnez les deux listes en ajoutant la propriété "character_name" à chaque élément de "result"
            let mergedResult = invitation_member_list.map(item => ({
                character_id: item.character_id,
                status: item.status,
                character_name: characterMap[item.character_id]
            }));

            // Vous pouvez maintenant accéder aux caractères correspondants dans mergedResult
            console.log("hihi", mergedResult)

            io.to(sender.toString()).emit('invitation_member_list', { members_list: mergedResult })
        })
    })
    
}

module.exports = {
    onReplyToInvitation,
    updateInvitationList
}