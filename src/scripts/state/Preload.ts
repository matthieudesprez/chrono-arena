module TacticArena.State {
  export class Preload extends Phaser.State {
    private preloadBar:Phaser.Sprite;

    preload() {
     /* this.preloadBar = this.add.sprite(290, 290, 'preload-bar');
      this.load.setPreloadSprite(this.preloadBar);*/
      this.load.tilemap('map', 'assets/json/map.json', null, Phaser.Tilemap.TILED_JSON);
      this.load.image('tiles-collection', 'assets/images/maptiles.png');
      this.load.image('path-tile', 'assets/images/path_tile.png');
      this.load.atlasJSONArray('player', 'assets/images/character.png', 'assets/images/character.json');
      this.load.atlasJSONArray('orc', 'assets/images/orc.png', 'assets/images/orc.json');
      this.load.atlasJSONArray('redhead', 'assets/images/redhead.png', 'assets/images/redhead.json');
      this.load.atlasJSONArray('skeleton', 'assets/images/skeleton.png', 'assets/images/skeleton.json');
    }

    create() {
      var that = this;
      $(document).ready(function() {
        that.game.state.start('main');
      });
    }
  }
}
