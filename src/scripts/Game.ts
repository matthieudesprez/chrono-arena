/// <reference path="./definitions/phaser.comments.d.ts"/>
module TypescriptPhaser {
  export class Game extends Phaser.Game {
    constructor() {
      super({
        width: 640,
        height: 640,
        renderer: Phaser.AUTO,
        parent: 'rightPanel'
      });

      this.state.add('boot', State.Boot);
      this.state.add('preload', State.Preload);
      this.state.add('main', State.Main);

      this.state.start('boot');
    }
  }
}
