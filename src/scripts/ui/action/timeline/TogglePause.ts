module TacticArena.Action.Timeline {
    export class TogglePause extends BaseAction {

        constructor() {
            super('toggle pause');
        }

        static process(state) {
            if(state.isPaused) { GoForward.process(state); }
            state.isPaused = !state.isPaused;
        }
    }
}
