module TacticArena.State {
    export class Preload extends TacticArena.State.BaseState {
        private preloadBar:Phaser.Image;
        private status;

        preload() {
            let background = this.game.make.image(this.centerX, 0, 'bg');
            background.anchor.set(0.5, 0);
            background.scale.set(0.9);
            let logo = this.game.make.image(this.centerX, 150, 'logo3');
            logo.anchor.set(0.5);
            this.game.add.text(0, 0, "f", {font: '1px Press Start 2P', fill: "#333333"});
            this.game.add.text(0, 0, "f", {font: '1px Iceland', fill: "#333333"});
            this.status = this.make.text(this.centerX, this.centerY + 200, '', {font: '25px Press Start 2P', fill: 'white'});
            this.status.anchor.setTo(0.5);
            this.preloadBar = this.make.image(this.centerX, this.centerY + 150, "loading");
            this.preloadBar.anchor.setTo(0.5);
            this.load.setPreloadSprite(this.preloadBar);
            this.game.load.onLoadStart.add(this.loadStart, this);
            this.game.load.onFileComplete.add(this.fileComplete, this);
            this.game.load.onLoadComplete.add(this.loadComplete, this);

            this.worldGroup.add(background);
            this.worldGroup.add(this.status);
            this.worldGroup.add(this.preloadBar);
            this.worldGroup.add(logo);

            /* MAPS */
            this.load.tilemap('mapmobile', 'assets/json/mapmobile.json', null, Phaser.Tilemap.TILED_JSON);
            this.load.tilemap('map', 'assets/json/map.json', null, Phaser.Tilemap.TILED_JSON);
            this.load.tilemap('area02', 'assets/json/area02.json', null, Phaser.Tilemap.TILED_JSON);
            this.load.image('tiles-collection', 'assets/images/maptiles.png');
            this.load.image('path-tile', 'assets/images/path_tile.png');

            /* UI **/
            this.load.image('selected-party-background', 'assets/images/ui/selected-party-background.png');
            this.load.image('ribbon', 'assets/images/ui/ribbon.png');
            this.load.image('team-background', 'assets/images/ui/team-background.png');
            this.load.image('button-bg', 'assets/images/ui/button.png');
            this.load.image('button-selected-bg', 'assets/images/ui/button-selected.png');
            this.load.image('button-square-next', 'assets/images/ui/button-square-next.png');
            this.load.image('button-square-previous', 'assets/images/ui/button-square-previous.png');
            this.load.image('avatar-frame', 'assets/images/ui/avatar-frame.png');
            this.load.image('bar-frame', 'assets/images/ui/bar-frame.png');
            this.load.image('skill-frame2', 'assets/images/ui/skill-frame2.png');
            this.load.image('frame-bottom', 'assets/images/ui/frame-bottom.png');
            this.load.image('frame-bottom-big', 'assets/images/ui/frame-bottom-big.png');
            this.load.image('background-bar', 'assets/images/ui/background-bar.png');
            this.load.image('background-modal', 'assets/images/ui/background-modal.png');
            this.load.image('background-menu', 'assets/images/ui/background-menu.jpg');
            this.load.atlasJSONArray('big-button', 'assets/images/ui/big-button.png', 'assets/images/ui/big-button.json');
            this.load.atlasJSONArray('small-button', 'assets/images/ui/small-button.png', 'assets/images/ui/small-button.json');
            this.load.atlasJSONArray('home-button', 'assets/images/ui/home-button.png', 'assets/images/ui/home-button.json');
            this.load.atlasJSONArray('team-button', 'assets/images/ui/group-button.png', 'assets/images/ui/group-button.json');
            this.load.atlasJSONArray('settings-button', 'assets/images/ui/settings-button.png', 'assets/images/ui/settings-button.json');

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
            this.load.image('icon-power4', 'assets/images/ui/icon-power4.png');
            this.load.image('icon-mp2', 'assets/images/ui/icon-mp2.png');
            this.load.atlasJSONArray('circle', 'assets/images/circle.png', 'assets/images/circle.json');

            ['walk', 'fire', 'wind', 'slash', 'watch'].forEach(skillName => {
                this.load.image('skill-' + skillName, 'assets/images/skill/' + skillName + '.jpg');
            });
            this.load.atlasJSONArray('fireball', 'assets/images/fireball.png', 'assets/images/fireball.json');
            this.load.atlasJSONArray('wind', 'assets/images/wind.png', 'assets/images/wind.json');

            ['ruairi', 'skeleton', 'evil', 'blondy'].forEach(characterName => {
                this.load.atlasJSONArray(characterName, 'assets/images/characters/' + characterName + '/spritesheet.png', 'assets/images/characters/' + characterName + '/spritesheet.json');
                this.load.image('avatar-' + characterName, 'assets/images/characters/' + characterName + '/avatar.png');
                this.load.image('avatar-' + characterName + '-small', 'assets/images/characters/' + characterName + '/avatar-small.png');
                this.load.image('frame-' + characterName, 'assets/images/characters/' + characterName + '/frame.png');
            });

            this.load.start();
        }

        loadStart () {
            this.status.setText('');
        }

        fileComplete (progress) {
            this.status.setText(progress + '%');
        }

        loadComplete () {
            this.game.state.start("menu");
        }
    }
}
