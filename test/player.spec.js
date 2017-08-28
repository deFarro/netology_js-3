'use strict';

describe('Class Player', () => {
  let position;

  beforeEach(() => {
    position = new Vector(10, 5);
  });

  describe('Constructor Player', () => {
    it('creates an object with actual position differs from passed position by 0:-0,5', () => {
      const player = new Player(position);

      expect(player.pos).to.eql(new Vector(10, 4.5));
    });

    it('creates object with size of 0,8:1,5', () => {
      const player = new Player();

      expect(player.size).to.eql(new Vector(0.8, 1.5));
    });

    it('has prop type equals to player', () => {
      const player = new Player();

      expect(player.type).to.equal('player');
    });
  });
});
