'use strict';

describe('Class LevelParser', () => {
  const Mushroom = extend(Actor, { type: { value: 'mushroom' }});
  const Gift = extend(Actor, { type: { value: 'gift' }});
  class BadActor {}

  describe('Constructor new LevelParser()', () => {
  });

  describe('actorFromSymbol method', () => {


    it('returns undefined if nothing passed', () => {
      const parser = new LevelParser();

      const actor = parser.actorFromSymbol();

      expect(actor).to.be.undefined;
    });

    it('returns undefined if passed unknown symbol', () => {
      const parser = new LevelParser({ y: Mushroom });

      const actor = parser.actorFromSymbol('z');

      expect(actor).to.be.undefined;
    });

    it('returns proper constructor corresponded to symbol', () => {
      const parser = new LevelParser({ y: Mushroom });

      const actor = parser.actorFromSymbol('y');

      expect(actor).to.equal(Mushroom);
    });
  });

  describe('obstacleFromSymbol method', () => {
    it('returns undefined if nothing passed', () => {
      const parser = new LevelParser();

      const obstacle = parser.obstacleFromSymbol();

      expect(obstacle).to.be.undefined;
    });

    it('returns undefined if passed symbl is unknown', () => {
      const parser = new LevelParser();

      const obstacle = parser.obstacleFromSymbol('Z');

      expect(obstacle).to.be.undefined;
    });

    it('returns wall if x passed', () => {
      const parser = new LevelParser();

      const obstacle = parser.obstacleFromSymbol('x');

      expect(obstacle).to.equal('wall');
    });

    it('returns lava if ! passed', () => {
      const parser = new LevelParser();

      const obstacle = parser.obstacleFromSymbol('!');

      expect(obstacle).to.equal('lava');
    });
  });

  describe('createGrid method', () => {
    let plan;

    beforeEach(() => {
      plan = [
        'x  x',
        '!!!!'
      ];
    });

    it('returns empty array if empty plan is passed', () => {
      const parser = new LevelParser();

      const grid = parser.createGrid([]);

      expect(grid).to.eql([]);
    });

    it('retrund array has the same length as passed plan', () => {
      const parser = new LevelParser();

      const grid = parser.createGrid(plan);

      expect(grid.length).to.equal(plan.length);
    });

    it('row contains the same amount of cells as row in a plan contains', () => {
      const parser = new LevelParser();

      const grid = parser.createGrid(plan);

      grid.forEach((row, y) => {
        expect(row.length).to.equal(plan[y].length);
      });
    });

    it('x symbols tranformed into walls and placed on proper coordinates', () => {
      const parser = new LevelParser();

      const grid = parser.createGrid(plan);

      expect(grid[0]).to.eql(['wall',undefined,undefined,'wall']);
    });

    it('! symbols tranformed into lava and placed on proper coordinates', () => {
      const parser = new LevelParser();

      const grid = parser.createGrid(plan);

      expect(grid[1]).to.eql(new Array(4).fill('lava'));
    });
  });

  describe('createActors method', () => {
    let plan;

    beforeEach(() => {
      plan = [
        'o   o',
        '  z  ',
        'o   o'
      ];
    });

    it('returns empty array if empty plan is passed', () => {
      const parser = new LevelParser({ o: Gift, z: Mushroom });

      const actors = parser.createActors([]);

      expect(actors).to.eql([]);
    });

    it('returns empty array if symbols for actors werent defined', () => {
      const parser = new LevelParser();

      const actors = parser.createActors(plan);

      expect(actors).to.eql([]);
    });

    it('ingores symbols that cant be found in database', () => {
      const parser = new LevelParser({ z: 'mushroom' });

      const actors = parser.createActors(['m']);

      expect(actors).to.eql([]);
    });

    it('ingores symbols that are not corresponding to functions', () => {
      const parser = new LevelParser({ z: 'mushroom' });

      const actors = parser.createActors(['z']);

      expect(actors).to.eql([]);
    });

    it('ingores symbols that are not corresponding to Actor instances', () => {
      const parser = new LevelParser({ b: BadActor });

      const actors = parser.createActors(['b']);

      expect(actors).to.eql([]);
    });

    it('creates moving object to Actor constractors', () => {
      const parser = new LevelParser({ z: Actor });

      const actors = parser.createActors(['z']);

      expect(actors).to.have.length(1);
    });

    it('created objects have proper types (Actor)', () => {
      const parser = new LevelParser({ z: Actor });

      const actors = parser.createActors(['z']);

      expect(actors[0]).to.be.an.instanceof(Actor);
    });

    it('creates objects with constuctors which extending Actor class', () => {
      const parser = new LevelParser({ z: Mushroom });

      const actors = parser.createActors(['z']);

      expect(actors).to.have.length(1);
    });

    it('created objects have proper types (Player, Coin, etc)', () => {
      const parser = new LevelParser({ z: Mushroom });

      const actors = parser.createActors(['z']);

      expect(actors[0]).to.be.an.instanceof(Mushroom);
    });

    it('returns an array with all moving objects', () => {
      const parser = new LevelParser({ o: Gift, z: Mushroom });

      const actors = parser.createActors(plan);

      expect(actors).to.have.length(5);
    });

    it('each moving object is an instance of its own class', () => {
      const parser = new LevelParser({ o: Gift, z: Mushroom });

      const actors = parser.createActors(plan);
      const oActors = actors.filter(actor => actor instanceof Gift);
      const zActors = actors.filter(actor => actor instanceof Mushroom);

      expect(oActors).to.have.length(4);
      expect(zActors).to.have.length(1);
    });

    it('each moving object has proper coordinates on the level', () => {
      const parser = new LevelParser({ o: Actor, z: Actor });

      const actors = parser.createActors(plan);

      expect(actors.some(actor => actor.pos.x === 0 && actor.pos.y === 0)).to.be.true;
      expect(actors.some(actor => actor.pos.x === 4 && actor.pos.y === 0)).to.be.true;
      expect(actors.some(actor => actor.pos.x === 2 && actor.pos.y === 1)).to.be.true;
      expect(actors.some(actor => actor.pos.x === 0 && actor.pos.y === 0)).to.be.true;
      expect(actors.some(actor => actor.pos.x === 4 && actor.pos.y === 2)).to.be.true;
    });
  });

  describe('parse method', () => {
    let plan;

    beforeEach(() => {
      plan = [
        ' oxo ',
        '!xzx!',
        ' oxo '
      ];
    });

    it('returns level object', () => {
      const parser = new LevelParser();

      const level = parser.parse([]);

      expect(level).to.be.an.instanceof(Level);
    });

    it('levels height is equal to amount of rows in a plan', () => {
      const parser = new LevelParser();

      const level = parser.parse(plan);

      expect(level.height).to.equal(3);
    });

    it('levels width is equal to the length of the longest row in a plan', () => {
      const parser = new LevelParser();

      const level = parser.parse(plan);

      expect(level.width).to.equal(5);
    });

    it('creates level with moving objects from a plan object', () => {
      const parser = new LevelParser({ o: Gift, z: Mushroom });

      const level = parser.parse(plan);

      expect(level.actors).to.have.length(5);
    });

    it('creates level with obstacles from a plan object', () => {
      const parser = new LevelParser();

      const level = parser.parse(plan);

      expect(level.grid).to.eql([
        [undefined, undefined,'wall',undefined,undefined],
        ['lava','wall',undefined,'wall','lava'],
        [undefined,undefined,'wall',undefined,undefined]
      ]);
    });
  });
});
