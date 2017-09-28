module TacticArena.State {
    export class Menu extends TacticArena.State.BaseState {
        menuGroup;

        create() {
            this.menuGroup = this.game.add.group();
            this.menuGroup.x = 0;
            this.menuGroup.y = 0;

            let background = this.game.add.image(this.game.world.centerX, 0, 'bg');
            background.anchor.set(0.5, 0);
            background.scale.set(0.9);

            let logo = this.game.add.image(this.game.world.centerX, 150, 'logo2');
            logo.anchor.set(0.5);

            let buttonsGroup = this.game.add.group();
            buttonsGroup.x = this.game.world.centerX;
            buttonsGroup.y = 280;

            let singleplayerButton = this.game.make.button(0, 0, 'big-button', function() {}, this, 'background-button-hover', 'background-button');
            singleplayerButton.anchor.set(0.5, 0);
            singleplayerButton.scale.set(0.7);
            singleplayerButton.inputEnabled = true;
            singleplayerButton.events.onInputDown.add(this.startSinglePlayer, this, 0);

            let singleplayerButtonLabel = this.game.add.text(0, 42, 'Training', {
                font: '20px Press Start 2P',
                fill: '#ffffff',
                boundsAlignH: 'right',
                boundsAlignV: 'top',
            });
            singleplayerButtonLabel.anchor.set(0.5, 0);

            let versusonlineButton = this.game.make.button(0, 140, 'big-button', function() {}, this, 'background-button-hover', 'background-button');
            versusonlineButton.anchor.set(0.5, 0);
            versusonlineButton.scale.set(0.7);
            versusonlineButton.inputEnabled = true;
            versusonlineButton.events.onInputDown.add(this.startMultiPlayer, this, 0);

            let versusonlineButtonLabel = this.game.add.text(0, 182, '1v1 Online', {
                font: '20px Press Start 2P',
                fill: '#ffffff',
                boundsAlignH: 'right',
                boundsAlignV: 'top',
            });
            versusonlineButtonLabel.anchor.set(0.5, 0);

            let optionButton = this.game.make.button(0, 280, 'big-button', function() {}, this, 'background-button-hover', 'background-button');
            optionButton.anchor.set(0.5, 0);
            optionButton.scale.set(0.7);
            optionButton.inputEnabled = true;
            optionButton.events.onInputDown.add(this.startOptions, this, 0);

            let optionButtonLabel = this.game.add.text(0, 322, 'Options', {
                font: '20px Press Start 2P',
                fill: '#ffffff',
                boundsAlignH: 'right',
                boundsAlignV: 'top',
            });
            optionButtonLabel.anchor.set(0.5, 0);

            buttonsGroup.add(singleplayerButton);
            buttonsGroup.add(singleplayerButtonLabel);
            buttonsGroup.add(versusonlineButton);
            buttonsGroup.add(versusonlineButtonLabel);
            buttonsGroup.add(optionButton);
            buttonsGroup.add(optionButtonLabel);

            //this.menuGroup.add(buttonsGroup);

            this.startSinglePlayer();
        }

        startSinglePlayer() {
            this.game.state.start('mainsolooffline', true, false, {
                players: [
                    {name: 'BOT 01', faction: 'evil', player: false},
                    {name: 'Matt', faction: 'human', player: true}
                ]
            }, null);
        }

        startMultiPlayer() {
            //$('.multiplayeronline').click(function () { that.game.state.start('lobby'); });
        }

        startOptions() {
            //this.game.state.start('options');
        }
    }
}
