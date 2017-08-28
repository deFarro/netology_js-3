'use strict';

describe('Class VerticalFireball', () => {
  describe('Constructor new VerticalFireball', () => {
    it('creates an instance of the Fireball class', () => {
      const ball = new VerticalFireball();

      expect(ball).to.be.an.instanceof(Fireball);
    });

    it('has speed of (0, 2)', () => {
      const ball = new VerticalFireball();

      expect(ball.speed).to.eql(new Vector(0, 2));
    });

    it('has prop type equals to fireball', () => {
      const ball = new HorizontalFireball();

      expect(ball.type).to.equal('fireball');
    });
  });
});
