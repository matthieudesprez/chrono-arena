module TacticArena.State {
  export class Boot extends Phaser.State {
    preload() {
        this.load.image('logo', 'assets/images/logo.png');
        this.load.image('loading', 'assets/images/loading.png');
    }

    create() {
      this.game.stage.backgroundColor = 0x333333;

      this.input.maxPointers = 1;
      this.stage.disableVisibilityChange = true;

      this.game.state.start('preload');
    }
  }
}
