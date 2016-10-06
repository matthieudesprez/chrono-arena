module TypescriptPhaser.State {
  export class Preload extends Phaser.State {
    private preloadBar:Phaser.Sprite;

    preload() {
     /* this.preloadBar = this.add.sprite(290, 290, 'preload-bar');
      this.load.setPreloadSprite(this.preloadBar);*/

      this.load.tilemap('map', 'assets/json/gridtiles.json', null, Phaser.Tilemap.TILED_JSON);
      this.load.image('tiles', 'assets/images/gridtiles.png');
      this.load.atlasJSONArray('player', 'assets/images/HammerBomber.png', 'assets/images/HammerBomber.json');

    }

    create() {
      this.game.state.start('main');
    }
  }
}
