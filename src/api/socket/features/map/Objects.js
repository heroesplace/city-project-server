class Point {
  constructor(x, y) {
      this.x = x;
      this.y = y;
  }
}

class Rectangle {
  constructor(x, y, width, height) {
      this.x = x;
      this.y = y;
      this.width = width;
      this.height = height;
  }

  contains(point) {
      return (this.x <= point.x && point.x < this.x + this.width &&
              this.y <= point.y && point.y < this.y + this.height)
  }

  intersects(range) {
      return !(range.x > this.x + this.width ||
               range.x + range.width < this.x ||
               range.y > this.y + this.height ||
               range.y + range.height < this.y);
  }
}

class Quadtree {
  constructor(boundary, capacity) {
      this.boundary = boundary; // Le rectangle qui délimite cette partie de l'arbre
      this.capacity = capacity; // Capacité maximale avant subdivision
      this.players = []; // Liste des joueurs dans ce quadrant
      this.divided = false; // Indique si le quadrant est subdivisé
  }

  subdivide() {
      const x = this.boundary.x;
      const y = this.boundary.y;
      const w = this.boundary.width / 2;
      const h = this.boundary.height / 2;

      // Crée quatre sous-quadrants
      const ne = new Rectangle(x + w, y, w, h);
      const nw = new Rectangle(x, y, w, h);
      const se = new Rectangle(x + w, y + h, w, h);
      const sw = new Rectangle(x, y + h, w, h);

      this.northeast = new Quadtree(ne, this.capacity);
      this.northwest = new Quadtree(nw, this.capacity);
      this.southeast = new Quadtree(se, this.capacity);
      this.southwest = new Quadtree(sw, this.capacity);

      this.divided = true;
  }

  insert(player) {
      if (!this.boundary.contains(player.position)) {
          return false;
      }

      if (this.players.length < this.capacity) {
          this.players.push(player);
          return true;
      } else {
          if (!this.divided) {
              this.subdivide();
          }
          if (this.northeast.insert(player)) return true;
          if (this.northwest.insert(player)) return true;
          if (this.southeast.insert(player)) return true;
          if (this.southwest.insert(player)) return true;
      }
      return false;
  }

  query(range, found) {
      if (!this.boundary.intersects(range)) {
          return;
      }
      for (let player of this.players) {
          if (range.contains(player.position)) {
              found.push(player);
          }
      }
      if (this.divided) {
          this.northeast.query(range, found);
          this.northwest.query(range, found);
          this.southeast.query(range, found);
          this.southwest.query(range, found);
      }
  }
}

class Player {
  constructor(x, y) {
      this.position = new Point(x, y);
  }
}

export { Point, Rectangle, Quadtree, Player }
