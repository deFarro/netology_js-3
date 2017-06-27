'use strict';

class Vector {
  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }
  plus(vector) {
    if (!(vector instanceof Vector)) {
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
    if (!(position instanceof Vector) || !(size instanceof Vector) || !(speed instanceof Vector)) {
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
    if (!obstacle || !(obstacle instanceof Actor)) {
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

const DIRECTIONS = [['top', 'bottom'], ['left', 'right']];

function compareActors(actor, obstacle) {
  if (actor.pos.x === obstacle.pos.x && actor.pos.y === obstacle.pos.y) {
    return true;
  }
  // Проверяем в отдельном цикле на наличие смежных границ
  for (let side of DIRECTIONS) {
    if (actor[side[1]] === obstacle[side[0]] || actor[side[0]] === obstacle[side[1]]) {
      return false;
    }
  }
  // Если границ нет, то проверяем на пересечения
  for (let side of DIRECTIONS) {
    if (actor[side[0]] > obstacle[side[1]] || actor[side[1]] < obstacle[side[0]]) {
      return false;
    }
  }
  return true;
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
    if (!actor || !(actor instanceof Actor)) {
      throw new Error;
    }
    for (let actorOnField of this.actors) {
      if (actor.isIntersect(actorOnField)) {
        return actorOnField;
      }
    }
  }
  obstacleAt(target, size) {
    if (!(target instanceof Vector) || !(size instanceof Vector)) {
      throw new Error;
    }
    const ghostActor = new Actor(target, size);
    if (ghostActor.left < 0 || ghostActor.right > this.width || ghostActor.top < 0) {
      return 'wall';
    }
    if (ghostActor.bottom > this.height) {
      return 'lava';
    }
    // Перебираем все ячейки, которые Actor готовится занять в цикле
    // for (let spot of mapActorCoordinates(ghostActor)) {
    //   if (this.grid[spot.y] && this.grid[spot.y][spot.x]) {
    //     return this.grid[spot.y][spot.x];
    //   }
    // }

    // Выбрал такой способ перебора препятствий, потому что он позволяет "нависать" над краем лавы, не сгорая
    const obstacleMap = mapActorCoordinates(ghostActor).map(spot => this.grid[spot.y] ? this.grid[spot.y][spot.x] : undefined);
    if (obstacleMap.indexOf('wall') >= 0) {
      return 'wall';
    }
    if (obstacleMap.indexOf('lava') >= 0) {
      return 'lava';
    }
    return undefined;
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

// Функция для создания массива со всеми координатами занимаемой объектом Actor области
function mapActorCoordinates(actor) {
  const coordinates = [];
  for (let y = 0; y < Math.ceil(actor.top % 1 + actor.size.y) ; y++) {
    for (let x = 0; x < Math.ceil(actor.left % 1 + actor.size.x) ; x++) {
    coordinates.push({'x': Math.floor(actor.left) + x, 'y': Math.floor(actor.top) + y});
    }
  }
  return coordinates;
}

class LevelParser {
  constructor(library) {
    this.library = library;
  }
  actorFromSymbol(symbol) {
    return symbol ? this.library[symbol] : undefined;
  }
  obstacleFromSymbol(symbol) {
    switch (symbol) {
      case 'x':
        return 'wall';
      case '!':
        return 'lava';
      default:
        return;
    }
  }
  createGrid(plan) {
    return plan.map(line => line.split('')
      .map(symbol => this.obstacleFromSymbol(symbol)));
  }
  createActors(plan) {
    if (plan.length === 0 || !this.library) {
      return [];
    }
    const actors = [], field =  plan.map(line => line.split(''));
    for (let line of field) {
      const y = field.indexOf(line);
      for (let index in line) {
        const x = parseInt(index);
        let symbol = line[index];
        if (!this.library[symbol] || typeof this.library[symbol] !== 'function') {
          continue;
        }
        else {
          const currentConstructor = this.actorFromSymbol(symbol);
          if (currentConstructor.prototype instanceof Actor || currentConstructor === Actor) {
            actors.push(new currentConstructor(new Vector(x, y)));
          }
        }
      }
    }
    return actors;
  }
  parse(plan) {
    return new Level(this.createGrid(plan), this.createActors(plan));
  }
}

class Fireball extends Actor {
  constructor(position, speed) {
    super(position, new Vector(1, 1), speed);
  }
  get type() {
    return 'fireball';
  }
  getNextPosition(time = 1) {
    const x = this.pos.x + this.speed.x * time;
    const y = this.pos.y + this.speed.y * time;
    return new Vector(x, y);
  }
  handleObstacle() {
    this.speed.x *= -1;
    this.speed.y *= -1;
  }
  act(time, level) {
    const target = this.getNextPosition(time);
    if (level.obstacleAt(target, this.size)) {
      this.handleObstacle();
    }
    else {
      this.pos = target;
    }
  }
}

class HorizontalFireball extends Fireball {
  constructor(position) {
    super(position, new Vector(2, 0));
  }
}

class VerticalFireball extends Fireball {
  constructor(position) {
    super(position, new Vector(0, 2));
  }
}

class FireRain extends Fireball {
  constructor(position) {
    super(position, new Vector(0, 3));
    this.initialPosition = position;
  }
  handleObstacle() {
    this.pos = this.initialPosition;
  }
}

class Coin extends Actor {
  constructor(position = new Vector()) {
    super(position.plus(new Vector(0.2, 0.1)), new Vector(0.6, 0.6));
    this.springSpeed = 8;
    this.springDist = 0.07;
    this.spring = Math.random() * (2 * Math.PI);
    this.initialPosition = this.pos;
  }
  get type() {
    return 'coin';
  }
  updateSpring(time = 1) {
    this.spring += this.springSpeed * time;
  }
  getSpringVector() {
    return new Vector(0, Math.sin(this.spring) * this.springDist);
  }
  getNextPosition(time = 1) {
    this.spring += this.springSpeed * time;
    return this.initialPosition.plus(this.getSpringVector());
  }
  act(time) {
    this.pos = this.getNextPosition(time);
  }
}

class Player extends Actor {
  constructor(position = new Vector()) {
    super(position.plus(new Vector(0, -0.5)), new Vector(0.8, 1.5), new Vector(0, 0))
  }
  get type() {
    return 'player';
  }
}

const actorDict = {
  '@': Player,
  'v': FireRain,
  '=': HorizontalFireball,
  '|': VerticalFireball,
  'o': Coin
}

// Проверка кода без loadLevels

// const schemas = [
//   [
//     '         ',
//     '         ',
//     '     =   ',
//     '       o ',
//     '     !xxx',
//     ' @       ',
//     'xxx!     ',
//     '         '
//   ],
//   [
//     '      v  ',
//     '         ',
//     '  v      ',
//     '        o',
//     '        x',
//     '@   x    ',
//     'x        ',
//     '         '
//   ]
// ];
//
// const parser = new LevelParser(actorDict);
// runGame(schemas, parser, DOMDisplay)
//   .then(() => console.log('Вы выиграли приз!'));

// Проверка кода с loadLevels

const parser = new LevelParser(actorDict);

loadLevels().then(levels => runGame(JSON.parse(levels), parser, DOMDisplay)
      .then(() => console.log('Вы выиграли приз!')));
