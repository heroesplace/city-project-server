exports.movePlayer = (player, direction) => {
    return new Promise((resolve, reject) => {
        switch (direction) {
            case "left": // Touche de gauche
                player.coords.x -= 32
                break;
            case "top": // Touche du haut
                player.coords.y -= 32
                break;
            case "right": // Touche de droite
                player.coords.x += 32
                break;
            case "bottom": // Touche du bas
                player.coords.y += 32
                break;
        }

        player.coords.direction = direction

        resolve(player.coords)
    })
}