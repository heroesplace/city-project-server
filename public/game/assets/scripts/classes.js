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

class Texture {
    constructor(image_path) {
        this.image = new Image()
        this.image.src = image_path

        this.loaded = false

        this.image.onload = () => {
            this.loaded = true
        }
    }

    isLoaded() {
        return this.loaded
    }

    getImage() {
        return this.image
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
        let that = this

        let img = new Image()
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
    constructor(texture, grid) {
        this.texture = texture
        this.grid = grid
    }

    draw(sx, sy, sw, sh, dx, dy, dw, dh) {
        if (this.texture.loaded) {
            this.grid.context.drawImage(this.texture.image, sx, sy, sw, sh, dx, dy, dw, dh)
        }
    }
}

/*
class TextObject {
    constructor(grid, text, x, y) {
        this.grid = grid
        this.text = text

        this.coords = { x: x, y: y }
    }

    clear(x1, y1) {
        this.grid.context.font = "12px Arial"

        // Mesurez les dimensions du texte sans le dessiner
        let dimensions = this.grid.context.measureText(this.text);

        // Obtenez la largeur et la hauteur mesurées
        let width = dimensions.width;
        let height = parseInt(this.grid.context.font)

        this.grid.context.fillStyle = "blue";
        this.grid.context.fillRect(x1, y1 - height, width, height)
        console.log("nouveau :", x1, y1 - height, width, height)
    }

    setPosition(x ,y) {
        this.clear(this.coords.x, this.coords.y)

        this.x = x
        this.y = y

        this.grid.context.font = "12px Arial"
        this.grid.context.fillText(this.text, x, y)
    }
}*/

class Player extends Sprite {
    constructor(socket, texture, grid) {
        super(texture, grid)

        this.socket = socket
        
        this.username = null

        this.coords = { x: 0, y: 0, direction: "bottom" }

        this.speed = 1
        this.step = 16 * this.speed

        this.width = 32
        this.height = 32

        this.sprite_schema = {
            "right": this.height * 3,
            "left": this.height * 2,
            "bottom": this.height,
            "top": 0,
        }
    }

    clear() {
        this.grid.context.clearRect(this.coords.x, this.coords.y, this.width, this.height)
    }

    display() {
        this.draw(0, this.sprite_schema[this.coords.direction], this.width, this.height, this.coords.x, this.coords.y, this.width, this.height)
    }

    setUsername(username) {
        this.username = username
    }

    setCoords(coords) {
        this.coords = coords
    }

    setPosition(x ,y, direction) {
        // Si le joueur a changé de position, on efface l'ancienne position
        if (x != this.coords.x || y != this.coords.y) this.clear(this.coords.x, this.coords.y, this.width, this.height)

        this.coords.x = x
        this.coords.y = y
        this.coords.direction = direction

        this.draw(0, this.sprite_schema[this.coords.direction], this.width, this.height, this.coords.x, this.coords.y, this.width, this.height)
    }
}