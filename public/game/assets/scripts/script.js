$(function() {
    // Execution start
    const socket = io()
    const username = parseJwt(getCookie("jwt_token"))["username"]

    let entities_list = {}

    socket.emit("log_as", getCookie("jwt_token"))

    socket.on("disconnect", () => {
        console.log("Disconnected from server.")

        window.location.href = "/"
    })

    // Textures
    const textures = {
        "sprite": new Texture("/game/assets/sprite.png")
    }

    // Grids
    const background_grid = new MapGrid($("canvas#background")[0], '/game/assets/grass_32.png')
    const entities_grid = new Grid(document.querySelectorAll("canvas#entities").item(0))
    const player_grid = new Grid(document.querySelectorAll("canvas#player").item(0))

    // Sprites
    let player_sprite = new Player(socket, textures["sprite"], player_grid)

    socket.on("tickrate", (data) => {
        for (const element of Object.values(entities_list)) {
            element.clear()
        }

        entities_list = {}

        for (const element of data) {
            if (element.username == username) {
                player_sprite.setPosition(element.coords.x, element.coords.y, element.coords.direction)
            } else {
                entities_list[element.username] = new Player(socket, textures["sprite"], entities_grid)
        
                entities_list[element.username].setUsername(element.username)
                entities_list[element.username].setPosition(element.coords.x, element.coords.y, element.coords.direction)
                entities_list[element.username].display()
            }
        }
    })

    document.addEventListener("keydown", function(event) {
        let direction = null

        switch (event.code) {
            case "ArrowLeft": // Touche de gauche
                direction = "left"
                break;
            case "ArrowUp": // Touche du haut
                direction = "top"
                break;
            case "ArrowRight": // Touche de droite
                direction = "right"
                break;
            case "ArrowDown": // Touche du bas
                direction = "bottom"
                break;
        }

        // iterate over entities_list
        if (direction != null) {
            socket.emit('ask_player_move', { "direction": direction })
        }
    })
})