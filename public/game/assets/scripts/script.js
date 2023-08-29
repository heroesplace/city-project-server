$(function() {
    // Execution start
    const socket = io()

    socket.emit("token_authentification", getCookie("jwt_token"))

    const currentCharacter = parseJwt(getCookie("jwt_token"))["currentCharacter"]

    let entities_list = {}

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

            if (element._id == currentCharacter) {
                player_sprite.setPosition(element.coords.x, element.coords.y, element.coords.direction)
            } else {
                entities_list[element.character_name] = new Player(socket, textures["sprite"], entities_grid)
        
                entities_list[element.character_name].setUsername(element.character_name)
                entities_list[element.character_name].setPosition(element.coords.x, element.coords.y, element.coords.direction)
                entities_list[element.character_name].display()
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

    document.querySelectorAll("div.user-interface div.chat form.input").item(0).addEventListener("submit", function(e) {
        send_message(e, socket)
    })

    socket.on("receive_message", (data) => {
        receive_message(data)
    })

    
    document.querySelectorAll("button#disconnect").item(0).addEventListener("click", function() {
        console.log("Disconnected from server.")

        deleteCookie("jwt_token")
        
        socket.disconnect()
        
        window.location.href = "/"

    })
})
