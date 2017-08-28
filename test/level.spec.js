'use strict';

describe('Class Level', () => {
  const Player = extend(Actor, { type: { value: 'player' }});
  const Mushroom = extend(Actor, { type: { value: 'mushroom' }});
  const Gift = extend(Actor, { type: { value: 'gift' }});
  const Coin = extend(Actor, { type: { value: 'coin' }});

  let player, mushroom, giftBig, giftSmall, goldCoin, bronzeCoin;

  beforeEach(() => {
    player = new Player;
    mushroom = new Mushroom;
    giftBig = new Gift;
    giftSmall = new Gift;
    goldCoin = new Coin;
    bronzeCoin = new Coin;
  });

  describe('Constructor new Level', () => {
    it('empty level is 0 rows high', () => {
      const level = new Level();

      expect(level.height).to.equal(0);
    });

    it('empty level is 0 columns wide', () => {
      const level = new Level();

      expect(level.width).to.equal(0);
    });

    it('level height equals to amount of grid rows', () => {
      const lines = 100;
      const grid = new Array(lines);

      const level = new Level(grid);

      expect(level.height).to.equal(lines);
    });

    it('level width equals to amount of line cells', () => {
      const lines = 100;
      const cells = 50;
      const grid = new Array(lines).fill(new Array(cells));

      const level = new Level(grid);

      expect(level.width).to.equal(cells);
    });

    it('level width is equal to length of the longest row', () => {
      const lines = 100;
      const cells = 50;
      const maxCells = 100;
      const grid = new Array(lines).fill(new Array(cells));
      grid[73].length = maxCells;

      const level = new Level(grid);

      expect(level.width).to.equal(maxCells);
    });

    it('level has prop status equals to null', () => {
      const level = new Level();

      expect(level.status).to.be.null;
    });

    it('has prop finishDelay equals to 1', () => {
      const level = new Level();

      expect(level.finishDelay).to.equal(1);
    });

    it('has prop actors with all moving elements that passed in the constructor', () => {
      const actors = [ player ];
      const level = new Level(undefined, actors);

      expect(level.actors).to.eql(actors);
    });

    it('has prop player with object which type props equals to player', () => {
      const level = new Level(undefined, [ player, mushroom ]);

      expect(level.player).to.equal(player);
    });
  });

  describe('isFinished method', () => {
    it('returns false by default', () => {
      const level = new Level();

      const isNotFinished = level.isFinished();

      expect(isNotFinished).to.be.false;
    });

    it('return true if status is not equal to null and finishDelay is less then 0', () => {
      const level = new Level();

      level.status = 'lost';
      level.finishDelay = -1;
      const isFinished = level.isFinished();

      expect(isFinished).to.be.true;
    });

    it('returns false if status is not equal to null but finishDelay is more then 0', () => {
      const level = new Level();

      level.status = 'lost';
      const isNotFinished = level.isFinished();

      expect(isNotFinished).to.be.false;
    });
  });

  describe('actorAt method', () => {

    it('throws an error is passed anything but instance of the Actor', () => {
      const level = new Level(undefined, [ player ]);

      function fn() {
        level.actorAt({});
      }

      expect(fn).to.throw(Error);
    });

    it('returns undefined for empty level', () => {
      const level = new Level();

      const noActor = level.actorAt(player);

      expect(noActor).to.be.undefined;
    });

    it('returns undefined if level contains only one moving object', () => {
      const level = new Level(undefined, [ player ]);

      const noActor = level.actorAt(player);

      expect(noActor).to.be.undefined;
    });

    it('returns undefined if none of the moving objects is intersecting passed object', () => {
      const player = new Player(new Vector(1, 1));
      const level = new Level(undefined, [ player, mushroom ]);

      const actor = level.actorAt(player);

      expect(actor).to.be.undefined;
    });

    it('returns object which is intersecting with passed object', () => {
      const level = new Level(undefined, [ player, mushroom ]);

      const actor = level.actorAt(player);

      expect(actor).to.be.equal(mushroom);
    });

  });

  describe('obstacleAt method', () => {
    const gridSize = 2;
    let grid, wallGrid, lavaGrid, size;

    beforeEach(() => {
      grid = new Array(gridSize).fill(new Array(gridSize));
      wallGrid = new Array(gridSize).fill(new Array(gridSize).fill('wall'));
      lavaGrid = new Array(gridSize).fill(new Array(gridSize).fill('lava'));
      size = new Vector(1, 1);
    });

    it('returns undefined if passed object is inside level borders and does not intersect anything', () => {
      const level = new Level(grid);
      const position = new Vector(0, 0);

      const wall = level.obstacleAt(position, size);

      expect(wall).to.be.undefined;
    });

    it('returns wall string if objects left border is out of level bounds', () => {
      const level = new Level(grid);
      const position = new Vector(-1, 0);

      const wall = level.obstacleAt(position, size);

      expect(wall).to.be.equal('wall');
    });

    it('returns wall string if objects right border is out of level bounds', () => {
      const level = new Level(grid);
      const position = new Vector(gridSize, 0);

      const wall = level.obstacleAt(position, size);

      expect(wall).to.be.equal('wall');
    });

    it('returns wall string if objects top border is out of level bounds', () => {
      const level = new Level(grid);
      const position = new Vector(0, -1);

      const wall = level.obstacleAt(position, size);

      expect(wall).to.be.equal('wall');
    });

    it('returns lava string if objects bottom border is out of level bounds', () => {
      const level = new Level(grid);
      const position = new Vector(0, gridSize);

      const wall = level.obstacleAt(position, size);

      expect(wall).to.be.equal('lava');
    });

    it('returns wall string if objects intersects a wall', () => {
      const level = new Level(wallGrid);
      const position = new Vector(0, 0);

      const wall = level.obstacleAt(position, size);

      expect(wall).to.be.equal('wall');
    });

    it('returns lava string if objects intersects a lava', () => {
      const level = new Level(lavaGrid);
      const position = new Vector(0, 0);

      const wall = level.obstacleAt(position, size);

      expect(wall).to.be.equal('lava');
    });

    it('returns wall string if objects intersects a wall and objects coordinates are not round numbers', () => {
      const level = new Level(wallGrid);
      const position = new Vector(0.5, 0.5);

      const wall = level.obstacleAt(position, size);

      expect(wall).to.be.equal('wall');
    });

    it('returns wall string if objects intersects a wall and objects size is not round number', () => {
      const level = new Level(wallGrid);
      const position = new Vector(0, 0);
      const size = new Vector(0.5, 0.5);

      const wall = level.obstacleAt(position, size);

      expect(wall).to.be.equal('wall');
    });
  });

  describe('removeActor method', () => {
    it('removes moving object', () => {
      const level = new Level(undefined, [ mushroom, giftSmall ]);

      level.removeActor(mushroom);

      expect(level.actors.includes(mushroom)).to.be.false;
    });

    it('removes proper moving object', () => {
      const level = new Level(undefined, [ mushroom, giftSmall ]);

      level.removeActor(mushroom);

      expect(level.actors.includes(giftSmall)).to.be.true;
    });
  });

  describe('noMoreActors method', () => {
    it('returns true if there are no moving objects on the level', () => {
      const level = new Level();

      expect(level.noMoreActors()).to.be.true;
    });

    it('returns true if there are on moving objects of exact type ob the level', () => {
      const level = new Level(undefined, [ mushroom, giftSmall ]);

      expect(level.noMoreActors('actor')).to.be.true;
    });

    it('returns true if there are any moving objects on the level', () => {
      const level = new Level(undefined, [ mushroom, giftSmall ]);

      expect(level.noMoreActors('mushroom')).to.be.false;
    });
  });

  describe('playerTouched method', () => {

    it('changes level status to lost if string lava is passed', () => {
      const level = new Level();

      level.playerTouched('lava');

      expect(level.status).to.equal('lost');
    });

    it('changes level status to lost if string fireball is passed', () => {
      const level = new Level();

      level.playerTouched('fireball');

      expect(level.status).to.equal('lost');
    });

    it('if string coin and coin object are passed method removes object from the level', () => {
      const level = new Level(undefined, [ goldCoin, bronzeCoin ]);

      level.playerTouched('coin', goldCoin);

      expect(level.actors).to.have.length(1);
      expect(level.actors).to.not.include(goldCoin);
    });

    it('if all coins are removed status is changed to won', () => {
      const level = new Level(undefined, [ goldCoin, bronzeCoin ]);

      level.playerTouched('coin', goldCoin);
      level.playerTouched('coin', bronzeCoin);

      expect(level.status).to.equal('won');
    });
  });
});
