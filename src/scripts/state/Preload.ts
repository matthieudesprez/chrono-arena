module TacticArena.State {
    export class Preload extends TacticArena.State.BaseState {
        private preloadBar:Phaser.Image;
        private status;

        preload() {
            let self = this;
            this.game.add.text(0, 0, "f", {font: '1px Press Start 2P', fill: "#333333"});
            this.game.add.text(0, 0, "f", {font: '1px Iceland', fill: "#333333"});
            super.createMenu();
            this.status = this.add.text(640 / 2, this.game.world.centerY / 2 + 200, 'Loading...', {fill: 'white'});
            this.status.anchor.setTo(0.5);
            this.preloadBar = this.add.image(640 / 2, this.game.world.centerY / 2 + 150, "loading");
            this.preloadBar.anchor.setTo(0.5);
            this.load.setPreloadSprite(this.preloadBar);

            /* MAPS */
            this.load.tilemap('mapmobile', 'assets/json/mapmobile.json', null, Phaser.Tilemap.TILED_JSON);
            this.load.tilemap('map', 'assets/json/map.json', null, Phaser.Tilemap.TILED_JSON);
            this.load.tilemap('area02', 'assets/json/area02.json', null, Phaser.Tilemap.TILED_JSON);
            this.load.image('tiles-collection', 'assets/images/maptiles.png');
            this.load.image('path-tile', 'assets/images/path_tile.png');

            /* UI */
            this.load.image('button-bg', 'assets/images/ui/button.png');
            this.load.image('button-selected-bg', 'assets/images/ui/button-selected.png');
            this.load.image('button-square-next', 'assets/images/ui/button-square-next.png');
            this.load.image('button-square-previous', 'assets/images/ui/button-square-previous.png');
            this.load.image('avatar-frame', 'assets/images/ui/avatar-frame.png');
            this.load.image('skill-frame2', 'assets/images/ui/skill-frame2.png');
            this.load.image('frame-bottom', 'assets/images/ui/frame-bottom.png');
            this.load.image('background-bar', 'assets/images/ui/background-bar.png');
            this.load.image('background-modal', 'assets/images/ui/background-modal.png');
            this.load.image('background-menu', 'assets/images/ui/background-menu.jpg');
            this.load.image('bg', 'assets/images/ui/bg3.png');
            this.load.atlasJSONArray('big-button', 'assets/images/ui/big-button.png', 'assets/images/ui/big-button.json');

            this.load.image('step', 'assets/images/ui/step.png');
            this.load.image('step-active', 'assets/images/ui/step-active.png');
            this.load.image('step-first', 'assets/images/ui/step-first.png');
            this.load.image('step-join', 'assets/images/ui/step-join.png');
            this.load.image('step-last', 'assets/images/ui/step-last.png');
            this.load.image('step-old', 'assets/images/ui/step-old.png');

            this.load.image('icon-dead', 'assets/images/ui/icon-dead.png');
            this.load.image('icon-heart', 'assets/images/ui/icon-heart.png');
            this.load.image('icon-menu4', 'assets/images/ui/icon-menu4.png');
            this.load.image('icon-cancel', 'assets/images/ui/icon-cancel.png');
            this.load.image('icon-confirm', 'assets/images/ui/icon-confirm.png');
            this.load.image('icon-health', 'assets/images/ui/icon-health.png');
            this.load.image('icon-power', 'assets/images/ui/icon-power.png');
            this.load.image('icon-power-empty', 'assets/images/ui/icon-power-empty.png');

            this.load.image('skill-walk', 'assets/images/skill/walk.jpg');
            this.load.image('skill-fire', 'assets/images/skill/fire.jpg');
            this.load.image('skill-wind', 'assets/images/skill/wind.jpg');
            this.load.image('skill-slash', 'assets/images/skill/slash.jpg');
            this.load.image('skill-watch', 'assets/images/skill/watch.jpg');

            //this.load.script('filter', 'https://cdn.rawgit.com/photonstorm/phaser/master/v2/filters/Pixelate.js');
            //this.load.script('BlurX', 'https://cdn.rawgit.com/photonstorm/phaser/master/v2/filters/BlurX.js');
            //this.load.script('BlurY', 'https://cdn.rawgit.com/photonstorm/phaser/master/v2/filters/BlurY.js');

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
            this.status.setText('Ready!');
            this.game.state.start("menu");
        }
    }
}
