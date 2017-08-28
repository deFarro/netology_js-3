'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Vector = function () {
  function Vector() {
    var x = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
    var y = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

    _classCallCheck(this, Vector);

    this.x = x;
    this.y = y;
  }

  _createClass(Vector, [{
    key: 'plus',
    value: function plus(vector) {
      if (!(vector instanceof Vector)) {
        throw new Error('Можно прибавлять к вектору только вектор типа Vector');
      }
      return new Vector(this.x + vector.x, this.y + vector.y);;
    }
  }, {
    key: 'times',
    value: function times(multip) {
      return new Vector(this.x * multip, this.y * multip);
    }
  }]);

  return Vector;
}();

var Actor = function () {
  function Actor() {
    var position = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new Vector(0, 0);
    var size = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : new Vector(1, 1);
    var speed = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : new Vector(0, 0);

    _classCallCheck(this, Actor);

    if (!(position instanceof Vector) || !(size instanceof Vector) || !(speed instanceof Vector)) {
      throw new Error();
    }
    this.pos = position;
    this.size = size;
    this.speed = speed;
  }

  _createClass(Actor, [{
    key: 'act',
    value: function act() {}
  }, {
    key: 'isIntersect',
    value: function isIntersect(obstacle) {
      if (!obstacle || !(obstacle instanceof Actor)) {
        throw new Error();
      }
      if (obstacle === this) {
        return false;
      }
      if (obstacle.pos.x === this.pos.x && obstacle.pos.y === this.pos.y && (obstacle.size.x < 0 || obstacle.size.y < 0)) {
        return false;
      }
      return compareActors(this, obstacle);
    }
  }, {
    key: 'left',
    get: function get() {
      return this.pos.x;
    }
  }, {
    key: 'top',
    get: function get() {
      return this.pos.y;
    }
  }, {
    key: 'right',
    get: function get() {
      return this.pos.x + this.size.x;
    }
  }, {
    key: 'bottom',
    get: function get() {
      return this.pos.y + this.size.y;
    }
  }, {
    key: 'type',
    get: function get() {
      return 'actor';
    }
  }]);

  return Actor;
}();

var DIRECTIONS = [['top', 'bottom'], ['left', 'right']];

function compareActors(actor, obstacle) {
  if (actor.pos.x === obstacle.pos.x && actor.pos.y === obstacle.pos.y) {
    return true;
  }
  // Проверяем в отдельном цикле на наличие смежных границ
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = DIRECTIONS[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var side = _step.value;

      if (actor[side[1]] === obstacle[side[0]] || actor[side[0]] === obstacle[side[1]]) {
        return false;
      }
    }
    // Если границ нет, то проверяем на пересечения
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  var _iteratorNormalCompletion2 = true;
  var _didIteratorError2 = false;
  var _iteratorError2 = undefined;

  try {
    for (var _iterator2 = DIRECTIONS[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
      var _side = _step2.value;

      if (actor[_side[0]] > obstacle[_side[1]] || actor[_side[1]] < obstacle[_side[0]]) {
        return false;
      }
    }
  } catch (err) {
    _didIteratorError2 = true;
    _iteratorError2 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion2 && _iterator2.return) {
        _iterator2.return();
      }
    } finally {
      if (_didIteratorError2) {
        throw _iteratorError2;
      }
    }
  }

  return true;
}

var Level = function () {
  function Level() {
    var grid = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
    var actors = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

    _classCallCheck(this, Level);

    this.grid = grid;
    this.actors = actors;
    this.status = null;
    this.finishDelay = 1;
  }

  _createClass(Level, [{
    key: 'isFinished',
    value: function isFinished() {
      return this.status !== null && this.finishDelay < 0 ? true : false;
    }
  }, {
    key: 'actorAt',
    value: function actorAt(actor) {
      if (!actor || !(actor instanceof Actor)) {
        throw new Error();
      }
      var _iteratorNormalCompletion3 = true;
      var _didIteratorError3 = false;
      var _iteratorError3 = undefined;

      try {
        for (var _iterator3 = this.actors[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
          var actorOnField = _step3.value;

          if (actor.isIntersect(actorOnField)) {
            return actorOnField;
          }
        }
      } catch (err) {
        _didIteratorError3 = true;
        _iteratorError3 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion3 && _iterator3.return) {
            _iterator3.return();
          }
        } finally {
          if (_didIteratorError3) {
            throw _iteratorError3;
          }
        }
      }
    }
  }, {
    key: 'obstacleAt',
    value: function obstacleAt(target, size) {
      var _this = this;

      if (!(target instanceof Vector) || !(size instanceof Vector)) {
        throw new Error();
      }
      var ghostActor = new Actor(target, size);
      if (ghostActor.left < 0 || ghostActor.right > this.width || ghostActor.top < 0) {
        return 'wall';
      }
      if (ghostActor.bottom > this.height) {
        return 'lava';
      }
      var obstacleMap = mapActorCoordinates(ghostActor).map(function (spot) {
        return _this.grid[spot.y] ? _this.grid[spot.y][spot.x] : undefined;
      });
      if (obstacleMap.indexOf('wall') >= 0) {
        return 'wall';
      }
      if (obstacleMap.indexOf('lava') >= 0) {
        return 'lava';
      }
    }
  }, {
    key: 'removeActor',
    value: function removeActor(actor) {
      var index = this.actors.indexOf(actor);
      if (index < 0) {
        return;
      }
      this.actors.splice(index, 1);
    }
  }, {
    key: 'noMoreActors',
    value: function noMoreActors(type) {
      return !this.actors.some(function (actor) {
        return actor.type === type;
      });
    }
  }, {
    key: 'playerTouched',
    value: function playerTouched(obstacle) {
      var actor = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      if (this.status !== null) {
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
  }, {
    key: 'height',
    get: function get() {
      return this.grid.length;
    }
  }, {
    key: 'width',
    get: function get() {
      if (this.grid.length === 0) {
        return 0;
      }
      return Math.max.apply(null, this.grid.map(function (line) {
        return line.length;
      }));
    }
  }, {
    key: 'player',
    get: function get() {
      return this.actors.filter(function (actor) {
        return actor.type === 'player';
      })[0];
    }
  }]);

  return Level;
}();

// Функция для создания массива со всеми координатами занимаемой объектом Actor области


function mapActorCoordinates(actor) {
  var coordinates = [];
  for (var y = 0; y < Math.ceil(actor.top % 1 + actor.size.y); y++) {
    for (var x = 0; x < Math.ceil(actor.left % 1 + actor.size.x); x++) {
      coordinates.push({ 'x': Math.floor(actor.left) + x, 'y': Math.floor(actor.top) + y });
    }
  }
  return coordinates;
}

var LevelParser = function () {
  function LevelParser(library) {
    _classCallCheck(this, LevelParser);

    this.library = library;
  }

  _createClass(LevelParser, [{
    key: 'actorFromSymbol',
    value: function actorFromSymbol(symbol) {
      return symbol ? this.library[symbol] : undefined;
    }
  }, {
    key: 'obstacleFromSymbol',
    value: function obstacleFromSymbol(symbol) {
      switch (symbol) {
        case 'x':
          return 'wall';
        case '!':
          return 'lava';
        default:
          return;
      }
    }
  }, {
    key: 'createGrid',
    value: function createGrid(plan) {
      var _this2 = this;

      return plan.map(function (line) {
        return line.split('').map(function (symbol) {
          return _this2.obstacleFromSymbol(symbol);
        });
      });
    }
  }, {
    key: 'createActors',
    value: function createActors(plan) {
      if (plan.length === 0 || !this.library) {
        return [];
      }
      var actors = [],
          field = plan.map(function (line) {
        return line.split('');
      });
      var _iteratorNormalCompletion4 = true;
      var _didIteratorError4 = false;
      var _iteratorError4 = undefined;

      try {
        for (var _iterator4 = field[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
          var line = _step4.value;

          var y = field.indexOf(line);
          for (var index in line) {
            var x = parseInt(index);
            var symbol = line[index];
            if (!this.library[symbol] || typeof this.library[symbol] !== 'function') {
              continue;
            } else {
              var currentConstructor = this.actorFromSymbol(symbol);
              if (currentConstructor.prototype instanceof Actor || currentConstructor === Actor) {
                actors.push(new currentConstructor(new Vector(x, y)));
              }
            }
          }
        }
      } catch (err) {
        _didIteratorError4 = true;
        _iteratorError4 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion4 && _iterator4.return) {
            _iterator4.return();
          }
        } finally {
          if (_didIteratorError4) {
            throw _iteratorError4;
          }
        }
      }

      return actors;
    }
  }, {
    key: 'parse',
    value: function parse(plan) {
      return new Level(this.createGrid(plan), this.createActors(plan));
    }
  }]);

  return LevelParser;
}();

var Fireball = function (_Actor) {
  _inherits(Fireball, _Actor);

  function Fireball(position, speed) {
    _classCallCheck(this, Fireball);

    return _possibleConstructorReturn(this, (Fireball.__proto__ || Object.getPrototypeOf(Fireball)).call(this, position, new Vector(1, 1), speed));
  }

  _createClass(Fireball, [{
    key: 'getNextPosition',
    value: function getNextPosition() {
      var time = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;

      return this.pos.plus(this.speed.times(time));
    }
  }, {
    key: 'handleObstacle',
    value: function handleObstacle() {
      this.speed.x *= -1;
      this.speed.y *= -1;
    }
  }, {
    key: 'act',
    value: function act(time, level) {
      var target = this.getNextPosition(time);
      if (level.obstacleAt(target, this.size)) {
        this.handleObstacle();
      } else {
        this.pos = target;
      }
    }
  }, {
    key: 'type',
    get: function get() {
      return 'fireball';
    }
  }]);

  return Fireball;
}(Actor);

var HorizontalFireball = function (_Fireball) {
  _inherits(HorizontalFireball, _Fireball);

  function HorizontalFireball(position) {
    _classCallCheck(this, HorizontalFireball);

    return _possibleConstructorReturn(this, (HorizontalFireball.__proto__ || Object.getPrototypeOf(HorizontalFireball)).call(this, position, new Vector(2, 0)));
  }

  return HorizontalFireball;
}(Fireball);

var VerticalFireball = function (_Fireball2) {
  _inherits(VerticalFireball, _Fireball2);

  function VerticalFireball(position) {
    _classCallCheck(this, VerticalFireball);

    return _possibleConstructorReturn(this, (VerticalFireball.__proto__ || Object.getPrototypeOf(VerticalFireball)).call(this, position, new Vector(0, 2)));
  }

  return VerticalFireball;
}(Fireball);

var FireRain = function (_Fireball3) {
  _inherits(FireRain, _Fireball3);

  function FireRain(position) {
    _classCallCheck(this, FireRain);

    var _this6 = _possibleConstructorReturn(this, (FireRain.__proto__ || Object.getPrototypeOf(FireRain)).call(this, position, new Vector(0, 3)));

    _this6.initialPosition = position;
    return _this6;
  }

  _createClass(FireRain, [{
    key: 'handleObstacle',
    value: function handleObstacle() {
      this.pos = this.initialPosition;
    }
  }]);

  return FireRain;
}(Fireball);

var Coin = function (_Actor2) {
  _inherits(Coin, _Actor2);

  function Coin() {
    var position = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new Vector();

    _classCallCheck(this, Coin);

    var _this7 = _possibleConstructorReturn(this, (Coin.__proto__ || Object.getPrototypeOf(Coin)).call(this, position.plus(new Vector(0.2, 0.1)), new Vector(0.6, 0.6)));

    _this7.springSpeed = 8;
    _this7.springDist = 0.07;
    _this7.spring = Math.random() * (2 * Math.PI);
    _this7.initialPosition = _this7.pos;
    return _this7;
  }

  _createClass(Coin, [{
    key: 'updateSpring',
    value: function updateSpring() {
      var time = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;

      this.spring += this.springSpeed * time;
    }
  }, {
    key: 'getSpringVector',
    value: function getSpringVector() {
      return new Vector(0, Math.sin(this.spring) * this.springDist);
    }
  }, {
    key: 'getNextPosition',
    value: function getNextPosition() {
      var time = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;

      this.spring += this.springSpeed * time;
      return this.initialPosition.plus(this.getSpringVector());
    }
  }, {
    key: 'act',
    value: function act(time) {
      this.pos = this.getNextPosition(time);
    }
  }, {
    key: 'type',
    get: function get() {
      return 'coin';
    }
  }]);

  return Coin;
}(Actor);

var Player = function (_Actor3) {
  _inherits(Player, _Actor3);

  function Player() {
    var position = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new Vector();

    _classCallCheck(this, Player);

    return _possibleConstructorReturn(this, (Player.__proto__ || Object.getPrototypeOf(Player)).call(this, position.plus(new Vector(0, -0.5)), new Vector(0.8, 1.5), new Vector(0, 0)));
  }

  _createClass(Player, [{
    key: 'type',
    get: function get() {
      return 'player';
    }
  }]);

  return Player;
}(Actor);

var actorDict = {
  '@': Player,
  'v': FireRain,
  '=': HorizontalFireball,
  '|': VerticalFireball,
  'o': Coin
};

var parser = new LevelParser(actorDict);

loadLevels().then(function (levels) {
  return runGame(JSON.parse(levels), parser, DOMDisplay).then(function () {
    return console.log('You won!');
  });
});