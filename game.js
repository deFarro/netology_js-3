'use strict';

class Vector {
  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }
  plus(vector) {
    if (!vector instanceof Vector) {
      throw new Error('Можно прибавлять к вектору только вектор типа Vector');
    }
    let sumOfVectors = new Vector;
    sumOfVectors.x = this.x + vector.x;
    sumOfVectors.y = this.y + vector.y;
    return sumOfVectors;
  }
  times(multip) {
    let multipVector = new Vector;
    multipVector.x = this.x * multip;
    multipVector.y = this.y * multip;
    return multipVector;
  }
}

class Actor {
  constructor(position = new Vector(0, 0), size = new Vector(1, 1), speed = new Vector(0, 0)) {
    if (!position instanceof Vector || !size instanceof Vector || !speed instanceof Vector) {
      throw new Error;
    }
    this.pos = position;
    this.size = size;
    this.speed = speed;
  }
  act () {}
  get left() {
    return this.pos.x;
  }
  get top() {
    return this.pos.y;
  }
  get right() {
    return this.pos.x + this.size.x;
  }
  get bottom() {
    return this.pos.y + this.size.y;
  }
  get type() {
    return 'actor';
  }
  isIntersect(obstacle) {
    if (!obstacle || !obstacle instanceof Actor) {
      throw new Error;
    }
    if (obstacle === this) {
      return false;
    }
    if (obstacle.pos.x === this.pos.x && obstacle.pos.y === this.pos.y && (obstacle.size.x < 0 || obstacle.size.y < 0)) {
      return false;
    }
    return compareActors(this, obstacle);
  }
}

const DIRECTIONS = [['top', 'bottom'], ['left', 'right'], ['bottom', 'top'], ['right', 'left']];

function compareActors(actor, obstacle) {
  if (obstacle.pos.x == actor.pos.x && obstacle.pos.y == actor.pos.y) {
    return true;
  }
  // Проверяем в отдельном цикле на наличие смежных границ
  for (let side of DIRECTIONS) {
    if (obstacle[side[0]] === actor[side[1]]) {
      return false;
    }
  }
  // Если границ нет, то проверяем на пересечения. У двух последних массивов сторон другой паттерн сравнения
  for (let side of DIRECTIONS) {
    if (DIRECTIONS.indexOf(side) > 1) {
      if (obstacle[side[0]] > actor[side[1]] && obstacle[side[0]] < actor[side[0]]) {
        return true;
      }
    }
    if (obstacle[side[0]] > actor[side[0]] && obstacle[side[0]] < actor[side[1]]) {
      return true;
    }
  }
  return false;
}

class Level {
  constructor(grid = [], actors = []) {
    this.grid = grid;
    this.actors = actors;
    this.status = null;
    this.finishDelay = 1;
  }
  get height() {
    return this.grid.length;
  }
  get width() {
    if (this.grid.length === 0) {
      return 0;
    }
    return Math.max.apply(null, this.grid.map(line => line.length));
  }
  get player() {
    return this.actors.filter(actor => actor.type === 'player')[0];
  }
  isFinished() {
    return this.status != null && this.finishDelay < 0 ? true : false;
  }
  actorAt(actor) {
    if (!actor || !actor instanceof Actor) {
      throw new Error;
    }
    for (let actorOnField of this.actors) {
      if (actor.isIntersect(actorOnField)) {
        return actorOnField;
      }
    }
  }
  obstacleAt(target, size) {
    if (!target instanceof Vector || !size instanceof Vector) {
      throw new Error;
    }
    const ghostActor = new Actor(target, size);
    if (ghostActor.left < 0 || ghostActor.right >= this.width || ghostActor.top < 0) {
      return 'wall';
    }
    if (ghostActor.bottom >= this.height) {
      return 'lava';
    }
    for (let spot of mapActorCoordinates(ghostActor)) {
      return this.grid[Math.floor(spot.x)][Math.floor(spot.y)] ? this.grid[Math.floor(spot.x)][Math.floor(spot.y)] : undefined;
    }
  }
  removeActor(actor) {
    let index = this.actors.indexOf(actor);
    if (index < 0) {
      return;
    }
    this.actors.splice(index, 1);
  }
  noMoreActors(type) {
    return !this.actors.some(actor => actor.type === type);
  }
  playerTouched(obstacle, actor = {}) {
    if (this.status != null) {
      return;
    }
    if (obstacle === 'lava' || obstacle === 'fireball') {
      this.status = 'lost';
    }
    if (obstacle === 'coin' && actor instanceof Actor) {
      this.removeActor(actor);
      if (this.noMoreActors('coin')) {
        this.status = 'won';
      }
    }
  }
}

// Функция для создания массива со всеми координатами заданной объектом Actor области
function mapActorCoordinates(actor) {
  const coordinates = [];
  for (let x = 0; x <= actor.size.x ; x++) {
    for (let y = 0; y <= actor.size.y ; y++) {
    coordinates.push({'x': actor.left + x, 'y': actor.top + y});
    }
  }
  return coordinates;
}

// const grid = [
//   new Array(3),
//   ['wall', 'wall', 'lava']
// ];
// const level = new Level(grid);
// runLevel(level, DOMDisplay);
