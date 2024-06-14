import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { getClient } from '../../../database/redis/index.js'
import { Quadtree, Rectangle } from './map/Objects.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const mapPath = path.resolve(__dirname, '../../../../private/map/slices.json')
const map = JSON.parse(fs.readFileSync(mapPath, 'utf8'))

const getBorder = (layerId, x, y, direction) => {
  const layer = getLayer(layerId)

  x = parseInt(x)
  y = parseInt(y)

  const frame = { width: 32, height: 18 }
  const columns = []

  const frameStart = {
    x: x - Math.floor(frame.width / 2) + 1,
    y: y - Math.floor(frame.height / 2) + 1
  }

  const frameEnd = {
    x: frameStart.x + frame.width - 1,
    y: frameStart.y + frame.height - 1
  }

  if (direction == "left") {
    for (let i = frameStart.y; i <= frameEnd.y; i++) {
      columns.push([i, frameStart.x])
    }
  }

  if (direction == "right") {
    for (let i = frameStart.y; i <= frameEnd.y; i++) {
      columns.push([i, frameEnd.x])
    }
  }

  if (direction == "up") {
    for (let i = frameStart.x; i <= frameEnd.x; i++) {
      columns.push([frameStart.y, i])
    }
  }

  if (direction == "down") {
    for (let i = frameStart.x; i <= frameEnd.x; i++) {
      columns.push([frameEnd.y, i])
    }
  }

  return columns.map(([y, x]) => {
    return (y >= 0 && x >= 0 && y < 100 && x < 100) ? layer[y][x] : -1
  })
}

const getLayer = (layerId) => {
  return map.layers[layerId].data
}

const getFrame = (layerId, x, y) => {
  x = Math.floor(x)
  y = Math.floor(y)

  const layer = getLayer(layerId)
  const frame = { width: 32, height: 18 }
  const indexes = []

  const frameStart = {
      x: x - Math.floor(frame.width / 2) + 1,
      y: y - Math.floor(frame.height / 2) + 1
  }

  const frameEnd = {
      x: frameStart.x + frame.width - 1,
      y: frameStart.y + frame.height - 1
  }

  for (let i = frameStart.y; i <= frameEnd.y; i++) {
    for (let j = frameStart.x; j <= frameEnd.x; j++) {
      indexes.push((i >= 0 && j >= 0 && j < 100 && x < 100) ? layer[i][j] : -1)
    }
  }

  return indexes
}

const getCharacterListCoords = async (characterIds) => {
  const client = getClient()

  const otherPlayers = []

  try {
    // Translate the character ids to their coordinates
    const results = await Promise.all(
      characterIds.map(async (characterId) => {
        const coords = await client.hgetall(`coords:characters:${characterId}`)
        return { characterId, coords }
      })
    )

    results.forEach((result, index) => {
      otherPlayers.push({
        characterId : result.characterId,
        coords: {
          x: result.coords.x,
          y: result.coords.y
        }
      })
    })
  } catch (err) {
    console.error('Error fetching hashes:', err)
  }

  return otherPlayers
}

const foundOtherPlayers = async (playerCoords, otherPlayers) => {
  const frame = { width: 32, height: 18 }

  const boundary = new Rectangle(0, 0, 1000, 1000)
  const quadtree = new Quadtree(boundary, 4)

  const searchArea = new Rectangle(
    playerCoords.x - frame.width / 2 + 1,
    playerCoords.y - frame.height / 2 + 1,
    frame.width,
    frame.height
  )

  const foundPlayers = []

  for (let player of otherPlayers) {
    quadtree.insert(player)
  }

  quadtree.query(searchArea, foundPlayers) // foundPlayers is now filled with players in the search area

  foundPlayers.forEach(other => {
    other.coords = getRelative(playerCoords, other.coords)
  })

  return foundPlayers
}

/* Calculate the relative position of a player compared to another */
function getRelative(player, other) {
    const frame = { width: 32, height: 18 }
    const delta = { x: player.x - other.x, y: player.y - other.y }

    return { x: (frame.width / 2 - 1) - delta.x, y: (frame.height / 2 - 1) - delta.y }
}

export { getFrame, getBorder, getRelative, foundOtherPlayers, getCharacterListCoords, getLayer }
