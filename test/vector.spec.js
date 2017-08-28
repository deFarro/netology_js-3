'use strict';

describe('Class Vector', () => {
  const x = 3, y = 7, left = 5, top = 10, n = 5;

  describe('Constructor new Vector()', () => {
    it('creates object with x and y props which are equal to passed arguments', () => {
      const position = new Vector(left, top);

      expect(position.x).is.equal(left);
      expect(position.y).is.equal(top);
    });

    it('default props are 0: 0', () => {
      const position = new Vector();

      expect(position.x).is.equal(0);
      expect(position.y).is.equal(0);
    });

  });

  describe('plus() method', () => {
    it('throws an Error if passed anything by instance of the Vector class', () => {
      const position = new Vector(x, y);

      function fn() {
        position.plus({ left, top });
      }

      expect(fn).to.throw(Error);
    });

    it('creates a new vector', () => {
      const position = new Vector(x, y);

      const newPosition = position.plus(new Vector(left, top));

      expect(newPosition).is.instanceof(Vector);
    });

    it('new vectors coordinates are equal to the sum of initial vector and the one passed in arguments', () => {
      const position = new Vector(x, y);

      const newPosition = position.plus(new Vector(left, top));

      expect(newPosition.x).is.equal(8);
      expect(newPosition.y).is.equal(17);
    });
  });

  describe('times() method', () => {
    it('creates a new vector', () => {
      const position = new Vector(x, y);

      const newPosition = position.times(n);

      expect(newPosition).is.instanceof(Vector);
    });

    it('coordinates of the new vector are multiplied by n', () => {
      const position = new Vector(x, y);

      const newPosition = position.times(n);

      expect(newPosition.x).is.equal(15);
      expect(newPosition.y).is.equal(35);
    });
  });

});
