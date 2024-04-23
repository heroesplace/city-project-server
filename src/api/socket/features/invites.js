const moment = require('moment')

const db = require('../../../database')

const { pullMailBox } = require('./mailbox')

const { handleSocketError } = require('../errors')

const onInviteCharacter = (event) => {
    const { io, socket, content } = event

    inviteCharacter(io, socket, socket.character_id, content)
}

const inviteCharacter = async (io, socket, sender, receiver) => {
    try {
        console.log(`[socket] Invitation de ${sender} à ${receiver}`)

        // On vérifie que le personnage existe et on récupère son ID
        const r1 = await db.query('SELECT id FROM characters WHERE name = $1', [receiver])

        if (r1.rows.length === 0) {
            throw new Error("CHARACTER_NOT_FOUND")
        } else {
            const receiver = r1.rows[0].id

            if (sender === receiver) throw new Error("SELF_INVITE")

            const r2 = await db.query('SELECT * FROM invites WHERE sender_id = $1 AND receiver_id = $2', [sender, r1.rows[0].id])

            // Si l'invitation n'existe pas, on la crée
            if (r2.rows.length === 0) {
                await db.query('INSERT INTO invites (sender_id, receiver_id) VALUES ($1, $2)', [sender, r1.rows[0].id])
            } else {
                throw new Error("ALREADY_INVITED")
            }
        }
    } catch (error) {
        handleSocketError(socket, error.message)
    }
    
    await pullInviteMembers(socket, sender)
    // On met à jour la messagerie du client qui a recu l'invitation
    // await pullMailBox(io.to(receiver.toString()), receiver.toString())
}

const onInviteDelete = (event) => {
    const { io, socket } = event

    inviteDelete(io, socket, socket.character_id)
}

const inviteDelete = async (io, socket, sender) => {
    console.log("[socket] Suppression de l'invitation de " + sender)

}

const onReplyToInvite = (event) => {
    const { io, socket, content } = event

    replyToInvite(io, socket, content.sender, socket.character_id, content.answer)
}

const replyToInvite = async (io, socket, sender, receiver, answer) => {
    // answer = true / false

    console.log(`[socket] Réponse à l'invitation de ${sender} à ${receiver} : ${answer}`)

    // Mettre à jour le statut à 1 (acceptée) pour l'invitation où sender = senderValue
    await db.query('UPDATE invites SET status = $1 WHERE sender_id = $2 AND receiver_id = $3;', [answer ? 1 : 2, sender, receiver])

    // On met à jour la boîte de réception du personnage qui a recu l'invitation
    await pullMailBox(io, socket.character_id)

    pullInviteMembers(io.to(sender), sender)
}

const onPullInviteMembers = (event) => {
    const { socket } = event

    pullInviteMembers(socket, socket.character_id)
}

const pullInviteMembers = async (socket, sender) => {
    try {
        const r = await db.query('SELECT characters.name name, status FROM invites JOIN characters ON receiver_id = characters.id WHERE sender_id = $1;', [sender])

        socket.emit('update_invite_members', { members_list: r.rows })
    } catch (error) {
        handleSocketError(socket, error.message)
    }
}

module.exports = {
    onInviteCharacter,
    inviteCharacter,

    onReplyToInvite,
    replyToInvite,

    onInviteDelete,
    inviteDelete,

    onPullInviteMembers,
    pullInviteMembers
}