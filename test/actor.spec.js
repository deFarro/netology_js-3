'use strict';

describe('Class Actor', () => {
  let position, size;

  beforeEach(() => {
    position = new Vector(30, 50);
    size = new Vector(5, 5);
  });

  describe('Constructor new Actor()', () => {
    it('creates object with pos prop (instance of Vector)', () => {
      const player = new Actor();

      expect(player.pos).is.instanceof(Vector);
    });

    it('creates object with size prop (instance of Vector)', () => {
      const player = new Actor();

      expect(player.size).is.instanceof(Vector);
    });

    it('creates object with speed prop (instance of Vector)', () => {
      const player = new Actor();

      expect(player.speed).is.instanceof(Vector);
    });

    it('creates object with type prop (string)', () => {
      const player = new Actor();

      expect(player.type).to.be.a('string');
    });

    it('creates object with act method', () => {
      const player = new Actor();

      expect(player.act).is.instanceof(Function);
    });

    it('default position of new object is 0:0', () => {
      const player = new Actor();

      expect(player.pos).is.eql(new Vector(0, 0));
    });

    it('default size of new object is 1x1', () => {
      const player = new Actor();

      expect(player.size).is.eql(new Vector(1, 1));
    });

    it('default speed of new object is 0:0', () => {
      const player = new Actor();

      expect(player.speed).is.eql(new Vector(0, 0));
    });

    it('default type of new object is actor', () => {
      const player = new Actor();

      expect(player.type).to.equal('actor');
    });

    it('type prop is immutable', () => {
      const player = new Actor();

      function fn() {
        player.type = 'player';
      }

      expect(fn).to.throw(Error);
    });

    it('creates object with proper position if instance of Vector is passed in the first argument', () => {
      const player = new Actor(position);

      expect(player.pos).is.equal(position);
    });

    it('throws an errow if the first argument is not an instance of Vecor', () => {

      function fn() {
        const player = new Actor({ x: 12, y: 24 });
      }

      expect(fn).to.throw(Error);
    });

    it('creates object with proper size if instance of Vector is passed in the second argument', () => {
      const player = new Actor(undefined, size);

      expect(player.size).is.equal(size);
    });

    it('throws an errow if the second argument is not an instance of Vecor', () => {

      function fn() {
        const player = new Actor(undefined, { x: 12, y: 24 });
      }

      expect(fn).to.throw(Error);
    });

    it('throws an errow if the third argument (speed) is not an instance of Vecor', () => {

      function fn() {
        const player = new Actor(undefined, undefined, { x: 12, y: 24 });
      }

      expect(fn).to.throw(Error);
    });
  });

  describe('Object borders', () => {
    it('has property left, which contains coordinate of the objects left border (axis X)', () => {
      const player = new Actor(position, size);

      expect(player.left).is.equal(30);
    });

    it('has property right, which contains coordinate of the objects right border (axis X)', () => {
      const player = new Actor(position, size);

      expect(player.right).is.equal(35);
    });

    it('has property top, which contains coordinate of the objects top border (axis Y)', () => {
      const player = new Actor(position, size);

      expect(player.top).is.equal(50);
    });

    it('has property bottom, which contains coordinate of the objects bottom border (axis Y)', () => {
      const player = new Actor(position, size);

      expect(player.bottom).is.equal(55);
    });
  });

  describe('isIntersect method', () => {
    it('throws an error if argument is not instance of the Actor class', () => {
      const player = new Actor();

      function fn() {
        player.isIntersect({ left: 0, top: 0, bottom: 1, right: 1 });
      }

      expect(fn).to.throw(Error);
    });

    it('object does not intersect itself', () => {
      const player = new Actor(position, size);

      const notIntersected = player.isIntersect(player);

      expect(notIntersected).is.equal(false);
    });

    it('object does not intersect far away object', () => {
      const player = new Actor(new Vector(0, 0));
      const coin = new Actor(new Vector(100, 100));

      const notIntersected = player.isIntersect(coin);

      expect(notIntersected).is.equal(false);
    });

    it('object does not intersect another object with a common border', () => {
      const player = new Actor(position, size);

      const moveX = new Vector(1, 0);
      const moveY = new Vector(0, 1);

      const coins = [
        new Actor(position.plus(moveX.times(-1))),
        new Actor(position.plus(moveY.times(-1))),
        new Actor(position.plus(size).plus(moveX)),
        new Actor(position.plus(size).plus(moveY))
      ];

      coins.forEach(coin => {
        const notIntersected = player.isIntersect(coin);

        expect(notIntersected).is.equal(false);
      });
    });

    it('object does not intersect another object which is placed on the same coordinatesm but has negative size vector', () => {
      const player = new Actor(new Vector(0, 0), new Vector(1, 1));
      const coin = new Actor(new Vector(0, 0), new Vector(1, 1).times(-1));

      const notIntersected = player.isIntersect(coin);

      expect(notIntersected).is.equal(false);
    });

    it('object do intersect another object which it fully contains', () => {
      const player = new Actor(new Vector(0, 0), new Vector(100, 100));
      const coin = new Actor(new Vector(10, 10), new Vector());

      const intersected = player.isIntersect(coin);

      expect(intersected).is.equal(true);
    });

    it('object do intersect another object which it partly contains', () => {
      const player = new Actor(position, size);

      const moveX = new Vector(1, 0);
      const moveY = new Vector(0, 1);

      const coins = [
        new Actor(position.plus(moveX.times(-1)), size),
        new Actor(position.plus(moveY.times(-1)), size),
        new Actor(position.plus(moveX), size),
        new Actor(position.plus(moveY), size)
      ];

      coins.forEach(coin => {
        const intersected = player.isIntersect(coin);

        expect(intersected).is.equal(true);
      });
    });

  });
});
