module TacticArena.State {
    export class Boot extends TacticArena.State.BaseState {
        preload() {
            this.load.image('loading', 'assets/images/loading.png');
        }

        create() {
            this.input.maxPointers = 1;
            this.stage.disableVisibilityChange = true;

            this.game.state.start('preload');
        }
    }
}
