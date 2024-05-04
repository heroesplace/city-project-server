import db from '../../../database/index.js'

const onPullMailbox = async ({ socket }) => {
    pullMailBox(socket,  socket.character_id)
}

const pullMailBox = async (socket, character_id) => {
    const r = await db.query('SELECT * FROM invites JOIN characters ON sender_id = characters.id WHERE receiver_id = $1 AND status = 0', [character_id])

    const invites = r.rows.map(value => ({
        _id: value.id,
        sender: {
            _id: value.sender_id,
            character_name: value.name
        },
        type: "invite"
    }))

    socket.emit("update_character_mailbox", { mail_list: invites })
}

export { onPullMailbox, pullMailBox }