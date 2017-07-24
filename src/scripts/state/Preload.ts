module TacticArena.State {
    export class Preload extends TacticArena.State.BaseState {
        private preloadBar:Phaser.Image;
        private status;

        preload() {
            this.game.add.text(0, 0, "f", {font: '1px Press Start 2P', fill: "#333333"});
            this.game.add.text(0, 0, "f", {font: '1px Iceland', fill: "#333333"});
            super.createMenu();
            this.status = this.add.text(640 / 2, this.game.world.centerY / 2 + 200, 'Loading...', {fill: 'white'});
            this.status.anchor.setTo(0.5);
            this.preloadBar = this.add.image(640 / 2, this.game.world.centerY / 2 + 150, "loading");
            this.preloadBar.anchor.setTo(0.5);
            this.load.setPreloadSprite(this.preloadBar);

            this.load.tilemap('mapmobile', 'assets/json/mapmobile.json', null, Phaser.Tilemap.TILED_JSON);
            this.load.tilemap('map', 'assets/json/map.json', null, Phaser.Tilemap.TILED_JSON);
            this.load.tilemap('area02', 'assets/json/area02.json', null, Phaser.Tilemap.TILED_JSON);
            this.load.image('tiles-collection', 'assets/images/maptiles.png');
            this.load.image('path-tile', 'assets/images/path_tile.png');
            this.load.image('modal-bg', 'assets/images/modal-bg.png');
            this.load.image('modal-close', 'assets/images/modal-close.png');
            this.load.image('menu-icon', 'assets/images/menu_icon.png');

            this.load.image('avatar-blondy', 'assets/images/blondy_avatar.png');
            this.load.image('avatar-redhead', 'assets/images/redhead_avatar.png');
            this.load.image('avatar-evil', 'assets/images/evil_avatar.png');
            this.load.image('avatar-skeleton', 'assets/images/skeleton_avatar.png');

            this.load.atlasJSONArray('player', 'assets/images/character.png', 'assets/images/character.json');
            this.load.atlasJSONArray('orc', 'assets/images/orc.png', 'assets/images/orc.json');
            this.load.atlasJSONArray('redhead', 'assets/images/redhead.png', 'assets/images/redhead.json');
            this.load.atlasJSONArray('skeleton', 'assets/images/skeleton.png', 'assets/images/skeleton.json');
            this.load.atlasJSONArray('blondy', 'assets/images/blondy.png', 'assets/images/blondy.json');
            this.load.atlasJSONArray('amanda', 'assets/images/amanda.png', 'assets/images/amanda.json');
            this.load.atlasJSONArray('evil', 'assets/images/evil.png', 'assets/images/evil.json');

            this.load.atlasJSONArray('snake', 'assets/images/snake.png', 'assets/images/snake.json');
            this.load.atlasJSONArray('poring', 'assets/images/poring.png', 'assets/images/poring.json');
            this.load.atlasJSONArray('roguefemale', 'assets/images/roguefemale.png', 'assets/images/roguefemale.json');

            this.load.atlasJSONArray('bee', 'assets/images/bee.png', 'assets/images/bee.json');
            this.load.atlasJSONArray('rabbit', 'assets/images/rabbit.png', 'assets/images/rabbit.json');

            this.load.atlasJSONArray('fireball', 'assets/images/fireball.png', 'assets/images/fireball.json');
            this.load.atlasJSONArray('wind', 'assets/images/wind.png', 'assets/images/wind.json');

            this.load.atlasJSONArray('circle', 'assets/images/circle.png', 'assets/images/circle.json');
            this.load.image('cursor_attack', 'assets/images/cursor_attack.png');
            this.load.image('cursor_pointer', 'assets/images/cursor_pointer.png');

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
            //that.game.state.start("menu");
            //that.game.state.start("mainadventure");
            that.game.state.start('mainsolooffline', true, false, {
                players: [
                    {name: 'BOT 01', faction: 'evil', player: false},
                    {name: 'Matt', faction: 'human', player: true}
                ]
            }, null);
            //that.game.state.start("lobby");
        }
    }
}
