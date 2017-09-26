module TacticArena.State {
    export class Options extends TacticArena.State.BaseState {
        menuGroup;

        create() {
            this.menuGroup = this.game.add.group();
            this.menuGroup.x = 0;
            this.menuGroup.y = 0;

            console.log(this.game.world);
            let background = this.game.add.image(this.game.world.centerX, this.game.world.centerY, 'bg');
            background.anchor.set(0.5);
            background.scale.set(2);

            let buttonsGroup = this.game.add.group();
            buttonsGroup.x = this.game.world.centerX;
            buttonsGroup.y = this.game.world.centerY / 2;

            let returnButton = this.game.make.button(0, 280, 'big-button', function() {}, this, 'background-button-hover', 'background-button');
            returnButton.anchor.set(0.5, 0);
            returnButton.scale.set(0.7);
            returnButton.inputEnabled = true;
            returnButton.events.onInputDown.add(this.startMenu, this, 0);

            let returnButtonLabel = this.game.add.text(0, 322, 'Return', {
                font: '20px Press Start 2P',
                fill: '#ffffff',
                boundsAlignH: 'right',
                boundsAlignV: 'top',
            });
            returnButtonLabel.anchor.set(0.5, 0);

            buttonsGroup.add(returnButton);
            buttonsGroup.add(returnButtonLabel);
        }

        startMenu () {
            this.game.state.start("menu");
        }
    }
}
