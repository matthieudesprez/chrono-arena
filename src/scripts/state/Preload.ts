module TacticArena.State {
    export class Preload extends TacticArena.State.BaseState {
        private preloadBar:Phaser.Image;
        private status;

        preload() {
            this.game.add.text(0, 0, "f", {font: '1px Press Start 2P', fill: "#333333"});
            super.createMenu();
            this.status = this.add.text(640 / 2, this.game.world.centerY / 2 + 200, 'Loading...', {fill: 'white'});
            this.status.anchor.setTo(0.5);
            this.preloadBar = this.add.image(640 / 2, this.game.world.centerY / 2 + 150, "loading");
            this.preloadBar.anchor.setTo(0.5);
            this.load.setPreloadSprite(this.preloadBar);

            this.load.tilemap('map', 'assets/json/map.json', null, Phaser.Tilemap.TILED_JSON);
            this.load.image('tiles-collection', 'assets/images/maptiles.png');
            this.load.image('path-tile', 'assets/images/path_tile.png');
            this.load.atlasJSONArray('player', 'assets/images/character.png', 'assets/images/character.json');
            this.load.atlasJSONArray('orc', 'assets/images/orc.png', 'assets/images/orc.json');
            this.load.atlasJSONArray('redhead', 'assets/images/redhead.png', 'assets/images/redhead.json');
            this.load.atlasJSONArray('skeleton', 'assets/images/skeleton.png', 'assets/images/skeleton.json');
            this.load.atlasJSONArray('blondy', 'assets/images/blondy.png', 'assets/images/blondy.json');
            this.load.atlasJSONArray('fireball', 'assets/images/fireball.png', 'assets/images/fireball.json');
            this.load.atlasJSONArray('circle', 'assets/images/circle.png', 'assets/images/circle.json');

            this.load.start();
        }

        create() {
            var that = this;
            //$(document).ready(function() {
            //  that.game.state.start('main');
            //});
            //
            this.status.setText('Ready!');

            //setTimeout(function () {
            //    that.game.state.start("menu");
            //}, 1000);
            that.game.state.start("main");
        }
    }
}
