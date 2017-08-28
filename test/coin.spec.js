'use strict';

describe('Class Coin', () => {
  let position;

  beforeEach(() => {
    position = new Vector(5, 5);
  });

  describe('Constructor new Coin', () => {
    it('creates instance of Actor', () => {
      const coin = new Coin();

      expect(coin).to.be.an.instanceof(Actor);
    });

    it('has prop type equals to coin', () => {
      const coin = new Coin();

      expect(coin.type).to.equal('coin');
    });

    it('has size of Vector(0.6, 0.6)', () => {
      const coin = new Coin();

      expect(coin.size).to.eql(new Vector(0.6, 0.6));
    });

    it('real position is moved by Vector(0.2, 0.1)', () => {
      const coin = new Coin(position);
      const realPosition = new Vector(5.2, 5.1);

      expect(coin.pos).to.eql(realPosition);
    });

    it('has prop spring that equals to random number between 0 and 2π', () => {
      const coin = new Coin();

      expect(coin.spring).to.be.within(0, 2 * Math.PI);
    });

    it('has prop springSpeed equals to 8', () => {
      const coin = new Coin();

      expect(coin.springSpeed).to.equal(8);
    });

    it('has prop springDist equals to 0.07', () => {
      const coin = new Coin();

      expect(coin.springDist).to.equal(0.07);
    });
  });

  describe('updateSpring method', () => {
    it('raises spring prop by springSpeed', () => {
      const coin = new Coin();
      const initialSpring = coin.spring;

      coin.updateSpring();

      expect(coin.spring).to.equal(initialSpring + 8);
    });

    it('raises spring prop by springSpeed multiplied by time if it is passed in second argument', () => {
      const time = 5;
      const coin = new Coin();
      const initialSpring = coin.spring;

      coin.updateSpring(time);

      expect(coin.spring).to.equal(initialSpring + 40);
    });
  });

  describe('getSpringVector method', () => {
    it('returns an instance of Vector', () => {
      const coin = new Coin();

      const vector = coin.getSpringVector();

      expect(vector).to.be.an.instanceof(Vector);
    });

    it('X coordinate is equal to 0', () => {
      const coin = new Coin();

      const vector = coin.getSpringVector();

      expect(vector.x).to.equal(0);
    });

    it('Y coordinate is equal to sin of spring multiplied by springDist', () => {
      const coin = new Coin();

      const vector = coin.getSpringVector();

      expect(vector.y).to.equal(Math.sin(coin.spring) * 0.07);
    });
  });

  describe('getNextPosition method', () => {
    it('raises spring by springSpeed', () => {
      const coin = new Coin(position);
      const initialSpring = coin.spring;

      coin.getNextPosition();

      expect(coin.spring).to.equal(initialSpring + 8);
    });

    it('raises spring prop by springSpeed multiplied by time if it is passed in second argument', () => {
      const time = 5;
      const coin = new Coin();
      const initialSpring = coin.spring;

      coin.getNextPosition(time);

      expect(coin.spring).to.equal(initialSpring + 40);
    });

    it('returns an instance of Vector', () => {
      const coin = new Coin(position);

      const newPosition = coin.getNextPosition();

      expect(newPosition).to.be.an.instanceof(Vector);
    });

    it('X coordinate wont change', () => {
      const coin = new Coin(position);
      const realPosition = coin.pos;

      const newPosition = coin.getNextPosition();

      expect(newPosition.x).to.equal(realPosition.x);
    });

    it('Y coordinate is between y and y + 1', () => {
      const coin = new Coin(position);

      const newPosition = coin.getNextPosition();
      expect(newPosition.y).to.be.within(position.y, position.y + 1);
    });

    it('returns new position by raising previous position by jumping vector', () => {
      const coin = new Coin(position);
      const realPosition = coin.pos;

      const newPosition = coin.getNextPosition();
      const springVector = coin.getSpringVector();

      expect(newPosition).to.eql(realPosition.plus(springVector));
    });
  });

  describe('act method', () => {
    it('update current position with the one returned by getNextPosition method', () => {
      const time = 5;
      const coin = new Coin(position);
      const spring = coin.spring;
      const newPosition = coin.getNextPosition(time);
      coin.spring = spring;

      coin.act(time);

      expect(coin.pos).to.eql(newPosition);
    });
  });
});
