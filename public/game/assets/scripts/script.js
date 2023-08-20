$(function() {
    // Execution start
    let players_list = {}

    const socket = io()
    // const socket = io.connect("http://libertyr0ad.fr:3005")
    
    let username = prompt("Quel est votre pseudo ?")

    socket.emit("log_as", username)

    // Graphics
    const background_grid = new MapGrid($("canvas#background")[0], './assets/grass_32.png')

    let players_grid = new Grid($("canvas#player")[0])
        players_grid.update((context) => {})

    socket.on("players_list", (data) => {
        players_list = {}

        for (const element of data) {
            console.log(element)

            players_list[element.username] = new Player(socket, element.username, element.coords.x, element.coords.y)
        
            players_grid.addSprite(players_list[element.username])
        }
    })

    socket.on("set_player_position", (data) => {
        console.log(data)
        players_list[data.username].setPosition(data.coords.x, data.coords.y)
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

        if (direction != null) {
            socket.emit('ask_player_move', { "username": username, "direction": direction })
        }
    })
})