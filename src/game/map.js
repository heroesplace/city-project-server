const world_map = require('../../world_map.json')

exports.world_map = world_map

exports.calcNewPart = (x, y) => {
    // x = 15 + 1 + 15 = 31
    // y = 8 + 1 + 8 = 17

    const x_radius = 15
    const y_radius = 8

    const start_x = x - x_radius
    const start_y = y - y_radius

    const end_x = x + x_radius // La colonne de fin
    const end_y = y + y_radius // La ligne de fin

    const newPart = []

    for (let i = start_y; i <= end_y; i++) {
        const row = []
        for (let j = start_x; j <= end_x; j++) {
            let a = world_map[i][j]
            if (typeof a === "undefined") {
                row.push("none")
            } else {
                row.push(world_map[i][j])
            }
        }
        newPart.push(row)
    }

    return newPart
}

exports.moveCamera = (player, direction) => {
    let step = 1

    switch (direction) {
        case "left": // Touche de gauche
            player.coords.x -= step
            break;
        case "top": // Touche du haut
            player.coords.y -= step
            break;
        case "right": // Touche de droite
            player.coords.x += step
            break;
        case "bottom": // Touche du bas
            player.coords.y += step
            break;
    }

    player.coords.direction = direction

    player.coords.x = Math.max(15, player.coords.x)
    player.coords.y = Math.max(8, player.coords.y)

    return player.coords
}