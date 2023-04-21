$(function() {
    class Grid {
        constructor(canvas) {
            this.widthTiles = 31
            this.heightTiles = 17

            this.tile_width = 32
            this.tile_height = 32

            this.canvas = canvas
            this.context = this.canvas.getContext('2d')
        }

        update(execute) {
            execute(this.context)
        }
    }

    class MapGrid {
        constructor(canvas, image_path) {
            this.widthTiles = 31
            this.heightTiles = 17

            this.tile_width = 32
            this.tile_height = 32

            this.canvas = canvas
            this.context = this.canvas.getContext('2d')

            this.image_path = image_path

            this.drawGrid()
        }

        drawGrid() {
            var that = this

            var img = new Image()
                img.src = this.image_path

            img.onload = function() {
                for (let xi=0;xi <= 100;xi++) {
                    for (let yi=0;yi <= 100;yi++) {
                        that.context.drawImage(img, xi * that.tile_width, yi * that.tile_height)
                        that.context.beginPath()
                    }
                }
        
                that.context.stroke()
            }
        }
    }

    class Sprite {
        constructor(image_path, grid) {
            this.image = new Image()
            this.image.src = image_path

            this.grid = grid
        }

        draw(sx, sy, sw, sh, dx, dy, dw, dh) {
            this.grid.context.clearRect(0, 0, this.grid.canvas.width, this.grid.canvas.height);

            this.grid.context.drawImage(this.image, sx, sy, sw, sh, dx, dy, dw, dh)
        }
    }

    class Player {
        constructor(sprite) {
            this.sprite = sprite
            this.speed = 1
            this.coords = { x: 7 * 32, y: 4 * 32 }
        }

        move(side) {
            const width = 32;
            const height = 32;

            let step = 16 * this.speed

            switch (side) {
                case "left": // Touche de gauche
                    console.log("Message 'Gauche' envoyé au serveur NodeJS")

                    socket.emit('message', { "move": "left" })
        
                    this.coords.x = this.coords.x - step

                    this.sprite.draw(0, height * 2, width, height, this.coords.x, this.coords.y, width, height)
                    break;
                case "top": // Touche du haut
                    console.log("Message 'Haut' envoyé au serveur NodeJS")

                    socket.emit('message', { "move": "top" })
                
                    this.coords.y = this.coords.y - step

                    this.sprite.draw(0, 0, width, height, this.coords.x, this.coords.y, width, height)
                    break;
                case "right": // Touche de droite
                    console.log("Message 'Droite' envoyé au serveur NodeJS")

                    socket.emit('message', { "move": "right" })
        
                    this.coords.x = this.coords.x + step
                    this.sprite.draw(0, height * 3, width, height, this.coords.x, this.coords.y, width, height)
                    break;
                case "bottom": // Touche du bas
                    console.log("Message 'Bas' envoyé au serveur NodeJS")

                    socket.emit('message', { "move": "bottom" })
    
                    this.coords.y = this.coords.y + step

                    this.sprite.draw(0, height, width, height, this.coords.x, this.coords.y, width, height)
                    break;
            }

            console.log(this.coords.x, this.coords.y)

        }
    }

    const socket = io()

    var background_grid = new MapGrid($("canvas#background")[0], './assets/grass_32.png')
        
    var players_grid = new Grid($("canvas#player")[0])
        players_grid.update((context) => {})

    var player_sprite = new Sprite('./assets/sprite.png', players_grid)

    var player = new Player(player_sprite)

    document.addEventListener("keydown", function(event) {
        if (event.keyCode == 37) side = "left"
        if (event.keyCode == 38) side = "top"
        if (event.keyCode == 39) side = "right"
        if (event.keyCode == 40) side = "bottom"

        player.move(side)
    })
})