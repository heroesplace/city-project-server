import fs from 'fs'

const map = JSON.parse(fs.readFileSync('./private/largemap.json', 'utf8')).layers[0].data

// FACTORISER CETTE FONCTION
const getMapPart = (x, y, direction) => {
  x = parseInt(x)
  y = parseInt(y)

  const border = 1000
  const frame = { width: 32, height: 18 }

  const coordsIndex = parseInt(y * border + x)
  const indexes = []

  switch (direction) {
    case "left": {
      const f = 0 - (frame.width / 2)
      const topCorner = coordsIndex + f - (frame.height / 2) * border

      for (let i = 0; i < frame.height; i++) {
        indexes.push(topCorner + (i * border))
      }

      break
    }

    case "right": {
      const f = (frame.width / 2) - 1
      const topCorner = coordsIndex + f - (frame.height / 2) * border

      for (let i = 0; i < frame.height; i++) {
          indexes.push(topCorner + (i * border))
      }

      break
    }

    case "up": {
      const f = 0 - (frame.width / 2)
      const topCorner = coordsIndex + f - (frame.height / 2) * border

      for (let i = 0; i < frame.width; i++) {
        indexes.push(topCorner + i)
      }

      break
    }

    case "down": {
      const f = 0 - (frame.width / 2) 
      const bottomCorner = coordsIndex + f + ((frame.height / 2) - 1) * border

      for (let i = 0; i < frame.width; i++) {
        indexes.push(bottomCorner + i)
      }

      break
    }
  }

  return indexes.map((index) => map[index])
}

const getMapFrame = (x, y) => {
  const border = 1000

  const frame = { width: 32, height: 18 }

  const frameStartX = Math.max(0, x - Math.floor(frame.width / 2))
  const frameStartY = Math.max(0, y - Math.floor(frame.height / 2))

  const maxStartX = Math.max(0, border - frame.width)
  const maxStartY = Math.max(0, border - frame.height)

  const startX = Math.min(frameStartX, maxStartX)
  const startY = Math.min(frameStartY, maxStartY)

  let path = []
  for (let row = 0; row < frame.height; row++) {
    // Convertis la coordonée en index de la liste
    const rowStartIndex = (startY + row) * border + startX

    const line = Array.from({ length: frame.width }, (_, index) => (rowStartIndex + index))
    path = path.concat(line)
  }

  const mapFrame = path.map((index) => map[index])

  return mapFrame
}

export { getMapFrame, getMapPart }
