
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

            players_list[element.username] = new Player(players_grid, socket, element.username, element.coords.x, element.coords.y)
        
            players_list[element.username].display()
        }
    })

    socket.on("message", (data) => {
        if (data.username != username) {
            players_list[data.username].move(data.move)
        }
    })

    document.addEventListener("keydown", function(event) {
        if (event.keyCode == 37) side = "left"
        if (event.keyCode == 38) side = "top"
        if (event.keyCode == 39) side = "right"
        if (event.keyCode == 40) side = "bottom"

        socket.emit('message', { "username": username, "move": side })
        players_list[username].move(side)
    })
})