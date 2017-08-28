'use strict';

describe('Class Fireball', () => {
  let time, speed, position;

  beforeEach(() => {
    time = 5;
    speed = new Vector(1, 0);
    position = new Vector(5, 5);
  });

  describe('Constructor new Fireball', () => {
    it('creates an instance of Actor class', () => {
      const ball = new Fireball();

      expect(ball).to.be.an.instanceof(Actor);
    });

    it('has prop type equals to fireball', () => {
      const ball = new Fireball();

      expect(ball.type).to.equal('fireball');
    });

    it('has prop position which is passed in the first argument', () => {
      const ball = new Fireball(position);

      expect(ball.pos).to.equal(position);
    });

    it('has prop speed which is passed in the second argument', () => {
      const ball = new Fireball(undefined, speed);

      expect(ball.speed).to.eql(speed);
    });
  });

  describe('getNextPosition method', () => {
    it('returns the same position for an object with speed equals to 0', () => {
      const zeroSpeed = new Vector(0, 0);
      const ball = new Fireball(position, zeroSpeed);

      const nextPosition = ball.getNextPosition();

      expect(nextPosition).to.eql(position);
    });

    it('returns new position raised by speed vector', () => {
      const ball = new Fireball(position, speed);

      const nextPosition = ball.getNextPosition();

      expect(nextPosition).to.eql(new Vector(6, 5));
    });

    it('returns new position raised by speed vector multiplied by time if it is passed in the first argument', () => {
      const ball = new Fireball(position, speed);

      const nextPosition = ball.getNextPosition(time);

      expect(nextPosition).to.eql(new Vector(10, 5));
    });
  });

  describe('handleObstacle method', () => {
    it('changes speed vector to opposite', () => {
      const ball = new Fireball(position, speed);

      ball.handleObstacle();

      expect(ball.speed).to.eql(new Vector(-1, -0));
    });
  });

  describe('act method', () => {
    it('changes position to a new one (got by getNextPosition method) if there are on obstacles on the way', () => {
      const level = {
        obstacleAt() {
          return false;
        }
      };
      const ball = new Fireball(position, speed);
      const nextPosition = new Vector(10, 5);

      ball.act(time, level);

      expect(ball.speed).to.eql(speed);
      expect(ball.pos).to.eql(nextPosition);
    });

    it('changes speed vector to opposite when hit obstacle', () => {
      const level = {
        obstacleAt() {
          return true;
        }
      };
      const ball = new Fireball(position, speed);

      ball.act(time, level);

      expect(ball.speed).to.eql(new Vector(-1, -0));
      expect(ball.pos).to.eql(position);
    });

    it('calls level.obstacleAt method with own size vector', () => {
      const ball = new Fireball(position, speed);
      let isCalled = false;
      const level = {
        obstacleAt(pos, size) {
          expect(size).to.eql(new Vector(1, 1));
          isCalled = true;
        }
      };

      ball.act(time, level);
      expect(isCalled).to.be.true;
    });

    it('calls level.obstacleAt with new position vector', () => {
      const ball = new Fireball(position, speed);
      let isCalled = false;
      const level = {
        obstacleAt(pos, size) {
          expect(pos).to.eql(new Vector(10, 5));
          isCalled = true;
        }
      };

      ball.act(time, level);
      expect(isCalled).to.be.true;
    });
  });
});
