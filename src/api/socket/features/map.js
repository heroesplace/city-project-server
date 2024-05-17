import fs from 'fs'

const map = JSON.parse(fs.readFileSync('./private/new_map.json', 'utf8')).layers[0].data

// FACTORISER CETTE FONCTION
const getMapPart = (x, y, direction) => {
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
    if (x > 0 && y > 0) return map[y][x]

    return -1
  })
}

const getMapFrame = (x, y) => {
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

  for (let i = frameStart.y; i <= frameEnd.y; i++) {
    for (let j = frameStart.x; j <= frameEnd.x; j++) {
      columns.push([i, j])
    }
  }

  return columns.map(([y, x]) => {
    if (x > 0 && y > 0) return map[y][x]

    return -1
  })
}

export { getMapFrame, getMapPart }
