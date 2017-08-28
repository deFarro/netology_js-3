'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function loadLevels() {
  return new Promise(function (done, fail) {
    var xhr = new XMLHttpRequest();
    var url = './levels.json';
    xhr.open('GET', url);
    xhr.addEventListener('error', function (e) {
      return fail(xhr);
    });
    xhr.addEventListener('load', function (e) {
      if (xhr.status !== 200) {
        fail(xhr);
      }
      done(xhr.responseText);
    });
    xhr.send();
  });
}

var scale = 30;
var maxStep = 0.05;
var wobbleSpeed = 8,
    wobbleDist = 0.07;
var playerXSpeed = 7;
var gravity = 30;
var jumpSpeed = 17;

function elt(name, className) {
  var elt = document.createElement(name);
  if (className) elt.className = className;
  return elt;
}

var DOMDisplay = function () {
  function DOMDisplay(parent, level) {
    _classCallCheck(this, DOMDisplay);

    this.wrap = parent.appendChild(elt("div", "game"));
    this.wrap.setAttribute('autofocus', true);
    this.level = level;

    this.actorMap = new Map();
    this.wrap.appendChild(this.drawBackground());
    this.actorLayer = this.wrap.appendChild(this.drawActors());
    this.drawFrame();
  }

  _createClass(DOMDisplay, [{
    key: 'drawBackground',
    value: function drawBackground() {
      var table = elt("table", "background");
      table.style.width = this.level.width * scale + "px";
      this.level.grid.forEach(function (row) {
        var rowElt = table.appendChild(elt("tr"));
        rowElt.style.height = scale + "px";
        row.forEach(function (type) {
          rowElt.appendChild(elt("td", type));
        });
      });
      return table;
    }
  }, {
    key: 'drawActor',
    value: function drawActor(actor) {
      return elt('div', 'actor ' + actor.type);
    }
  }, {
    key: 'updateActor',
    value: function updateActor(actor, rect) {
      rect.style.width = actor.size.x * scale + "px";
      rect.style.height = actor.size.y * scale + "px";
      rect.style.left = actor.pos.x * scale + "px";
      rect.style.top = actor.pos.y * scale + "px";
    }
  }, {
    key: 'drawActors',
    value: function drawActors() {
      var _this = this;

      var wrap = elt('div');
      this.level.actors.forEach(function (actor) {
        var rect = wrap.appendChild(_this.drawActor(actor));
        _this.actorMap.set(actor, rect);
      });
      return wrap;
    }
  }, {
    key: 'updateActors',
    value: function updateActors() {
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = this.actorMap[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var _step$value = _slicedToArray(_step.value, 2),
              actor = _step$value[0],
              rect = _step$value[1];

          if (this.level.actors.includes(actor)) {
            this.updateActor(actor, rect);
          } else {
            this.actorMap.delete(actor);
            rect.parentElement.removeChild(rect);
          }
        }
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
    }
  }, {
    key: 'drawFrame',
    value: function drawFrame() {
      this.updateActors();

      this.wrap.className = "game " + (this.level.status || "");
      this.scrollPlayerIntoView();
    }
  }, {
    key: 'scrollPlayerIntoView',
    value: function scrollPlayerIntoView() {
      var width = this.wrap.clientWidth;
      var height = this.wrap.clientHeight;
      var margin = width / 3;

      // The viewport
      var left = this.wrap.scrollLeft,
          right = left + width;
      var top = this.wrap.scrollTop,
          bottom = top + height;

      var player = this.level.player;
      if (!player) {
        return;
      }
      var center = player.pos.plus(player.size.times(0.5)).times(scale);

      if (center.x < left + margin) this.wrap.scrollLeft = center.x - margin;else if (center.x > right - margin) this.wrap.scrollLeft = center.x + margin - width;
      if (center.y < top + margin) this.wrap.scrollTop = center.y - margin;else if (center.y > bottom - margin) this.wrap.scrollTop = center.y + margin - height;
    }
  }, {
    key: 'clear',
    value: function clear() {
      this.wrap.parentNode.removeChild(this.wrap);
    }
  }]);

  return DOMDisplay;
}();

var arrowCodes = { 37: "left", 38: "up", 39: "right" };

function trackKeys(codes) {
  var pressed = Object.create(null);
  function handler(event) {
    if (codes.hasOwnProperty(event.keyCode)) {
      var down = event.type == "keydown";
      pressed[codes[event.keyCode]] = down;
      event.preventDefault();
    }
  }
  addEventListener("keydown", handler);
  addEventListener("keyup", handler);
  return pressed;
}

function runAnimation(frameFunc) {
  var lastTime = null;
  function frame(time) {
    var stop = false;
    if (lastTime != null) {
      var timeStep = Math.min(time - lastTime, 100) / 1000;
      stop = frameFunc(timeStep) === false;
    }
    lastTime = time;
    if (!stop) {
      requestAnimationFrame(frame);
    }
  }
  requestAnimationFrame(frame);
}

function runLevel(level, Display) {
  initGameObjects();
  return new Promise(function (done) {
    var arrows = trackKeys(arrowCodes);
    var display = new Display(document.body, level);
    runAnimation(function (step) {
      level.act(step, arrows);
      display.drawFrame(step);
      if (level.isFinished()) {
        display.clear();
        done(level.status);
        return false;
      }
    });
  });
}

function initGameObjects() {
  if (initGameObjects.isInit) {
    return;
  }

  initGameObjects.isInit = true;

  Level.prototype.act = function (step, keys) {
    var _this2 = this;

    if (this.status !== null) {
      this.finishDelay -= step;
    }

    while (step > 0) {
      var thisStep = Math.min(step, maxStep);
      this.actors.forEach(function (actor) {
        actor.act(thisStep, _this2, keys);
      });

      if (this.status === 'lost') {
        this.player.pos.y += thisStep;
        this.player.size.y -= thisStep;
      }

      step -= thisStep;
    }
  };

  Player.prototype.handleObstacle = function (obstacle) {
    if (this.wontJump) {
      this.speed.y = -jumpSpeed;
    } else {
      this.speed.y = 0;
    }
  };

  Player.prototype.move = function (motion, level) {
    var newPos = this.pos.plus(motion);
    var obstacle = level.obstacleAt(newPos, this.size);
    if (obstacle) {
      level.playerTouched(obstacle);
      this.handleObstacle(obstacle);
    } else {
      this.pos = newPos;
    }
  };

  Player.prototype.moveX = function (step, level, keys) {
    this.speed.x = 0;
    if (keys.left) this.speed.x -= playerXSpeed;
    if (keys.right) this.speed.x += playerXSpeed;

    var motion = new Vector(this.speed.x, 0).times(step);
    this.move(motion, level);
  };

  Player.prototype.moveY = function (step, level, keys) {
    this.speed.y += step * gravity;
    this.wontJump = keys.up && this.speed.y > 0;

    var motion = new Vector(0, this.speed.y).times(step);
    this.move(motion, level);
  };

  Player.prototype.act = function (step, level, keys) {
    this.moveX(step, level, keys);
    this.moveY(step, level, keys);

    var otherActor = level.actorAt(this);
    if (otherActor) {
      level.playerTouched(otherActor.type, otherActor);
    }
  };
}

function runGame(plans, Parser, Display) {
  return new Promise(function (done) {
    function startLevel(n) {
      runLevel(Parser.parse(plans[n]), Display).then(function (status) {
        if (status === "lost") {
          startLevel(n);
        } else if (n < plans.length - 1) {
          startLevel(n + 1);
        } else {
          done();
        }
      });
    }
    startLevel(0);
  });
}

function rand() {
  var max = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 10;
  var min = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

  return Math.floor(Math.random() * (max - min + 1)) + min;
}