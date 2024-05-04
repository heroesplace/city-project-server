import largeMap from "../../../../config/largeMap.json" assert { type: "json" }

const onPlayerMove = async ({ socket, content }) => {
    playerMove(socket, content.direction)
}

const playerMove = async (socket, direction) => {
    console.log('playerMove', direction)

    const bottomLayer = largeMap.layers[0]
    const row = bottomLayer.data.slice(0, 18)

    console.log(row)

    let data = []

    if (direction === 'right' || direction === 'left') {
        data = [
            Array(18).fill(126),
            [150]
        ]
    } 

    if (direction === 'up' || direction === 'down') {
        data = [Array(30).fill(126)]
    }

    socket.emit('move', { direction, map_part: data })
}

const onPullMap = async (event) => {
    const { socket } = event

    pullMap(socket)
}

const pullMap = async (socket) => {
    // Faire quelque chose ici
}

export { onPullMap, pullMap, onPlayerMove }