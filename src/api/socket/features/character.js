import db from '../../../database/postgresql/index.js'
import { getClient } from '../../../database/redis/index.js'

import { getMapFrame } from './map.js'

const onIsVillager = async ({ socket }) => {
  const result = await isVillager(socket.characterId)
  socket.emit('character_is_villager', { is_villager: result })
}

const isVillager = async (characterId) => {
  const r1 = await db.query('SELECT * FROM village_members WHERE character_id = $1', [characterId])

  return r1.rows.length !== 0
}

const onCharacterSpawn = async ({ socket }) => {
  const client = getClient()

  const coords = await client.hGetAll(`coords:characters:${socket.characterId}`)

  const mapFrame = getMapFrame(coords)

  // console.log('voila ta map fdp ', mapFrame)

  socket.emit('character_spawn', { map_frame: mapFrame })
}

const onCharacterMove = async ({ socket, content }) => {
  move(socket, socket.characterId, content.direction)
}

// Movements
const move = async (socket, characterId, direction) => {
  const client = getClient()
  const path = `coords:characters:${characterId}`
  console.log('path = ', path)
  console.log(direction)

  if (direction === 'right' || direction === 'left') {
    await client.hIncrBy(path, 'x', (direction === 'right') ? 1 : -1)
  }

  if (direction === 'up' || direction === 'down') {
    await client.hIncrBy(path, 'y', (direction === 'down') ? 1 : -1)
  }

  // socket.emit('character_move', { direction, map_part: data })
}

export {
  onIsVillager,
  isVillager,
  onCharacterSpawn,
  onCharacterMove
}
