const mongodb = require('../../../database')
const mongoose = require('mongoose')

const isAlreadyInvited = (sender, receiver) => {
    return mongodb.models.Invites.findOne({ sender: sender }).then((invite) => {
        if (invite) {
            for (const [_, value] of Object.entries(invite.receiver)) {
                if (value.character_id.toString() == receiver.toString()) {
                    return true
                }
            }
        }

        return false
    })
}

const onReplyToInvite = (io, socket, sender, receiver, answer) => {
    // answer = true / false
    
    async function updateInviteStatus(receiver, sender) {
        if (answer) {
            // Mettre à jour le statut à 2 pour l'invitation où sender = senderValue
            await mongodb.models.Invites.updateMany(
                { 'sender': { $ne: sender }, 'receiver.character_id': receiver },
                { $set: { 'receiver.$.status': 2 } }
            ).exec()
        }

        // Mettre à jour le statut à 1 pour les autres invitations
        await mongodb.models.Invites.updateOne(
            { 'sender': sender, 'receiver.character_id': receiver },
            { $set: { 'receiver.$.status': (answer) ? 1 : 2  } }
        )
    }

    mongodb.models.Characters.findOne({ _id: receiver }).then((character) => {
        console.log(character.invites)

        mongodb.models.Invites.find({ _id: { $in: character.invites } }).then((invites) => {
            // Mettre à jour le statut à 1 pour l'invitation où sender = senderValue
            updateInviteStatus(receiver, sender).then(() => {
                updateInvitesList(io, sender)
            })
        })
    })
}

const updateInvitesList = (io, sender) => {
    mongodb.models.Invites.findOne({ sender: sender }).then((invites) => {
        if (!invites) return
        
        let invites_member_list = invites.receiver

        // TODO: Send notification to sender
        mongodb.models.Characters.find({ _id: { $in: invites_member_list.map((value) => value.character_id) } }).select("character_name").then((characters) => {
            // Créez un objet de correspondance entre les caractères et leurs noms
            let characterMap = {}
            characters.forEach(character => {
                characterMap[character._id] = character.character_name
            })

            // Fusionnez les deux listes en ajoutant la propriété "character_name" à chaque élément de "result"
            let mergedResult = invites_member_list.map(item => ({
                character_id: item.character_id,
                status: item.status,
                character_name: characterMap[item.character_id]
            }));

            // Vous pouvez maintenant accéder aux caractères correspondants dans mergedResult
            io.to(sender.toString()).emit('update_invite_members', { members_list: mergedResult })
        })
    })
    
}

module.exports = {
    onReplyToInvite,
    updateInvitesList
}