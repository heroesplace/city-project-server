const db = require('../../../../database')

const { pullMailBox } = require('../mailbox')

const { CharacterError, InviteError } = require('../../errors')

const onAddCharacter = async (event) => {
    const { io, socket, content } = event

    try {
        await addCharacter(io, socket, socket.character_id, content)
    } catch (error) {
        error.display(socket)
    }
}

const addCharacter = async (io, socket, sender, receiver) => {
    console.log(`[socket] Invitation de ${sender} à ${receiver}`)

    const r1 = await db.query('SELECT id FROM characters WHERE name = $1', [receiver])

    if (r1.rows.length === 0) throw new CharacterError("CHARACTER_NOT_FOUND")

    const receiver_id = r1.rows[0].id

    if (sender === receiver_id) throw new InviteError("SELF_INVITE")

    const r2 = await db.query('SELECT * FROM invites WHERE sender_id = $1 AND receiver_id = $2', [sender, receiver_id])

    // Si l'invitation n'existe pas, on la crée
    if (r2.rows.length !== 0) throw new InviteError("ALREADY_INVITED")

    await db.query('INSERT INTO invites (sender_id, receiver_id) VALUES ($1, $2)', [sender, receiver_id])

    await pullCharacters(socket, sender)
    // On met à jour la messagerie du client qui a recu l'invitation
    await pullMailBox(io.to(receiver_id), receiver_id)
}

const onRemoveCharacter = (event) => {
    const { io, socket, content } = event

    removeCharacter(io, socket, socket.character_id, content)
}

const removeCharacter = async (io, socket, sender, receiver) => {

}        

const onCancel = (event) => {
    const { io, socket } = event

    cancel(io, socket, socket.character_id)
}

const cancel = async (io, socket, sender) => {
    console.log("[socket] Suppression de l'invitation de " + sender)

    const invites = await db.query('DELETE FROM invites WHERE sender_id = $1 RETURNING receiver_id', [sender])

    invites.rows.forEach(i => pullMailBox(io, i.receiver_id))
}

const onReply = (event) => {
    const { io, socket, content } = event

    reply(io, socket, content.sender, socket.character_id, content.answer)
}

const reply = async (io, socket, sender, receiver, answer) => {
    // answer = true / false

    console.log(`[socket] Réponse à l'invitation de ${sender} à ${receiver} : ${answer}`)

    // Mettre à jour le statut à 1 (acceptée) pour l'invitation où sender = senderValue
    await db.query('UPDATE invites SET status = $1 WHERE sender_id = $2 AND receiver_id = $3;', [answer ? 1 : 2, sender, receiver])

    // On met à jour la boîte de réception du personnage qui a recu l'invitation
    await pullMailBox(io, socket.character_id)

    pullCharacters(io.to(sender), sender)
}

const onPullCharacters = (event) => {
    const { socket } = event

    pullCharacters(socket, socket.character_id)
}

const pullCharacters = async (socket, sender) => {
    try {
        const r = await db.query('SELECT characters.name name, status FROM invites JOIN characters ON receiver_id = characters.id WHERE sender_id = $1;', [sender])

        socket.emit('invite_pull_characters', { members_list: r.rows })
    } catch (error) {
        console.log(error.message)
    }
}

module.exports = {
    onAddCharacter,
    addCharacter,

    onRemoveCharacter,
    removeCharacter,

    onReply,
    reply,

    onCancel,
    cancel,

    onPullCharacters,
    pullCharacters
}