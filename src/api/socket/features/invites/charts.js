import db from '../../../../database/postgresql/index.js'
import { pullMailBox } from '../mailbox.js'
import { CharacterError, InviteError } from '../../errors.js'

const onAddCharacter = async ({ io, socket, content }) => {
  try {
    await addCharacter(io, socket, socket.characterId, content)
  } catch (error) {
    error.display(socket)
  }
}

const addCharacter = async (io, socket, sender, receiver) => {
  console.log(`[socket] Invitation de ${sender} à ${receiver}`)

  const r1 = await db.query('SELECT id FROM characters WHERE name = $1', [receiver])

  if (r1.rows.length === 0) throw new CharacterError('CHARACTER_NOT_FOUND')

  const receiverId = r1.rows[0].id

  if (sender === receiverId) throw new InviteError('SELF_INVITE')

  const r2 = await db.query('SELECT * FROM invites WHERE sender_id = $1 AND receiver_id = $2', [sender, receiverId])

  if (r2.rows.length !== 0) throw new InviteError('ALREADY_INVITED')

  await db.query('INSERT INTO invites (sender_id, receiver_id) VALUES ($1, $2)', [sender, receiverId])

  await pullCharacters(socket, sender)
  await pullMailBox(io.to(receiverId), receiverId)
}

const onRemoveCharacter = ({ io, socket, content }) => {
  removeCharacter(io, socket, socket.characterId, content)
}

const removeCharacter = async (io, socket, sender, receiver) => {
  // Implémenter la suppression du personnage ici
}

const onCancel = ({ io, socket }) => {
  cancel(io, socket, socket.characterId)
}

const cancel = async (io, socket, sender) => {
  console.log("[socket] Suppression de l'invitation de " + sender)

  const invites = await db.query('DELETE FROM invites WHERE sender_id = $1 RETURNING receiver_id', [sender])

  invites.rows.forEach(i => pullMailBox(io, i.receiverId))
}

const onReply = ({ io, socket, content }) => {
  reply(io, socket, content.sender, socket.characterId, content.answer)
}

const reply = async (io, socket, sender, receiver, answer) => {
  console.log(`[socket] Réponse à l'invitation de ${sender} à ${receiver} : ${answer}`)

  await db.query('UPDATE invites SET status = $1 WHERE sender_id = $2 AND receiver_id = $3', [answer ? 1 : 2, sender, receiver])

  await pullMailBox(io, socket.characterId)
  pullCharacters(io.to(sender), sender)
}

const onPullCharacters = ({ socket }) => {
  pullCharacters(socket, socket.characterId)
}

const pullCharacters = async (socket, sender) => {
  try {
    const r = await db.query('SELECT characters.name name, status FROM invites JOIN characters ON receiver_id = characters.id WHERE sender_id = $1', [sender])
    socket.emit('invite_pull_characters', { members_list: r.rows })
  } catch (error) {
    console.log(error.message)
  }
}

export default {
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
