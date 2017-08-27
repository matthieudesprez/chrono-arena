module TacticArena.Action.Timeline {
    export class TogglePause extends BaseAction {

        constructor() {
            super('toggle pause');
        }

        static process(state) {
            if(state.isPaused) {
                state.isPaused = false;
                GoForward.process(state);
            } else {
                state.isPaused = true;
            }
        }
    }
}
