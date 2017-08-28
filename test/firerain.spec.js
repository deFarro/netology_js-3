'use strict';

describe('class FireRain', () => {
  let position;

  beforeEach(() => {
    position = new Vector(5, 5);
  });

  describe('Constructor new FireRain', () => {
    it('creates an instance if Fireball', () => {
      const ball = new FireRain();

      expect(ball).to.be.an.instanceof(Fireball);
    });

    it('has speed of Vector(0, 3)', () => {
      const ball = new FireRain();

      expect(ball.speed).to.eql(new Vector(0, 3));
    });

    it('has type equals to fireball', () => {
      const ball = new HorizontalFireball();

      expect(ball.type).to.equal('fireball');
    });
  });

  describe('handleObstacle method', () => {
    it('doesnt change speed vector', () => {
      const ball = new FireRain(position);

      ball.handleObstacle();

      expect(ball.speed).to.eql(new Vector(0, 3));
    });

    it('changes position to initial', () => {
      const ball = new FireRain(position);
      ball.pos = new Vector(100, 100);

      ball.handleObstacle();

      expect(ball.pos).to.eql(position);
    });
  });
});
