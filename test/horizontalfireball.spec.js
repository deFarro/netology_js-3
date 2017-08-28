'use strict';

describe('Class HorizontalFireball', () => {
  describe('Constructor new HorizontalFireball', () => {
    it('creates an instance of Fireball', () => {
      const ball = new HorizontalFireball();

      expect(ball).to.be.an.instanceof(Fireball);
    });

    it('has speed of Vector(2, 0)', () => {
      const ball = new HorizontalFireball();

      expect(ball.speed).to.eql(new Vector(2, 0));
    });

    it('has prop type equals to fireball', () => {
      const ball = new HorizontalFireball();

      expect(ball.type).to.equal('fireball');
    });
  });
});
