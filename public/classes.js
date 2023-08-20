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

    clear(x1, y1, x2, y2) {
        this.grid.context.clearRect(x1, y1, x2, y2)
    }

    draw(sx, sy, sw, sh, dx, dy, dw, dh) {
        // this.grid.context.clearRect(0, 0, this.grid.canvas.width, this.grid.canvas.height);

        this.grid.context.drawImage(this.image, sx, sy, sw, sh, dx, dy, dw, dh)
    }
}

class Player {
    constructor(players_grid, socket, username, x, y) {
        this.players_grid = players_grid
        this.socket = socket
        this.username = username
        this.sprite = new Sprite('./assets/sprite.png', this.players_grid)
        this.coords = { x: x, y: y }

        this.speed = 1
        this.step = 16 * this.speed
    }

    display() {
        this.sprite.image.onload = () => {
            this.sprite.draw(0, 0, 32, 32, this.coords.x, this.coords.y, 32, 32)
        }
    }

    setPosition(x ,y) {
        const width = 32
        const height = 32

        this.sprite.clear(this.coords.x, this.coords.y, width, height)

        let sprite_value = null

        if (x > this.coords.x) { // Right
            sprite_value = height * 3
        } else if (x < this.coords.x) { // Left
            sprite_value = height * 2
        } else if (y > this.coords.y) { // Bottom
            sprite_value = height
        } else if (y < this.coords.y) { // Top
            sprite_value = 0
        }

        this.coords.x = x
        this.coords.y = y

        this.sprite.draw(0, sprite_value, width, height, this.coords.x, this.coords.y, width, height)

        console.log(this.coords.x, this.coords.y)
    }
}