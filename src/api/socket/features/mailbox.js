import db from '../../../database/postgresql/index.js'

const onPullMailbox = async ({ socket }) => {
  pullMailBox(socket, socket.characterId)
}

const pullMailBox = async (socket, characterId) => {
  const r = await db.query('SELECT * FROM invites JOIN characters ON sender_id = characters.id WHERE receiver_id = $1 AND status = 0', [characterId])

  const invites = r.rows.map(value => ({
    _id: value.id,
    sender: {
      _id: value.sender_id,
      characterName: value.name
    },
    type: 'invite'
  }))

  socket.emit('update_character_mailbox', { mail_list: invites })
}

export { onPullMailbox, pullMailBox }
