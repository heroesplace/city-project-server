import db from '../../../database/postgresql/index.js'
import { getClient } from '../../../database/redis/index.js'
import { getOthersSessions } from '../index.js'

import { getFrame, getBorder, foundOtherPlayers, getCharacterListCoords } from './map.js'

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

  const r = await client.hgetall(`coords:characters:${socket.characterId}`)

  const coords = {
    x: parseFloat(r.x),
    y: parseFloat(r.y)
  }

  console.log(coords)

  const othersCoords = await getCharacterListCoords(getOthersSessions(socket))
  const others = await foundOtherPlayers({ x: coords.x, y: coords.y }, othersCoords)

  const bottomLayerFrame = getFrame(0, coords.x, coords.y)
  const worldLayerFrame = getFrame(1, coords.x, coords.y)
  const aboveLayerFrame = getFrame(2, coords.x, coords.y)

  socket.emit('character_spawn', {
    layers: [
      bottomLayerFrame,
      worldLayerFrame,
      aboveLayerFrame
    ],
    others,
    precision: {
      x: coords.x - Math.floor(coords.x),
      y: coords.y - Math.floor(coords.y)
    }
  })
}

const onAskForMap = async ({ socket, content }) => {
  const client = getClient()

  const coords = await client.hgetall(`coords:characters:${socket.characterId}`)

  const othersCoords = await getCharacterListCoords(getOthersSessions(socket))
  const others = await foundOtherPlayers({ x: coords.x, y: coords.y }, othersCoords)

  const bottomLayerBorder = getBorder(0, coords.x, coords.y, content.direction)
  const worldLayerBorder = getBorder(1, coords.x, coords.y, content.direction)
  const aboveLayerBorder = getBorder(2, coords.x, coords.y, content.direction)

  socket.emit('character_move', {
    direction: content.direction,
    layers: [
      bottomLayerBorder,
      worldLayerBorder,
      aboveLayerBorder
    ],
    others
  })
}

const onCharacterMove = async ({ socket, content }) => {
  const client = getClient()

  const path = `coords:characters:${socket.characterId}`

  await client.hincrbyfloat(path, 'x', content.distance.x)
  await client.hincrbyfloat(path, 'y', content.distance.y)
}

export {
  onIsVillager,
  isVillager,
  onCharacterSpawn,
  onCharacterMove
}
