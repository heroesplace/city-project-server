import db from '../../../database/postgresql/index.js'
import { getClient } from '../../../database/redis/index.js'

import { getMapFrame, getMapPart } from './map.js'

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

  const mapFrame = getMapFrame(coords.x, coords.y)

  socket.emit('character_spawn', { map_frame: mapFrame })
}

const onCharacterMove = async ({ socket, content }) => {
  const client = getClient()

  moveCharacter(socket.characterId, content.direction)

  const coords = await client.hGetAll(`coords:characters:${socket.characterId}`)

  const mapPart = getMapPart(coords.x, coords.y, content.direction)

  socket.emit('character_move', { direction: content.direction, map_part: mapPart })
}

// Movements
const moveCharacter = async (characterId, direction) => {
  const client = getClient()
  const path = `coords:characters:${characterId}`

  console.log(direction)

  if (direction === 'right' || direction === 'left') {
    await client.hIncrBy(path, 'x', (direction === 'right') ? 1 : -1)
  }

  if (direction === 'up' || direction === 'down') {
    await client.hIncrBy(path, 'y', (direction === 'down') ? 1 : -1)
  }
}

export {
  onIsVillager,
  isVillager,
  onCharacterSpawn,
  onCharacterMove
}
