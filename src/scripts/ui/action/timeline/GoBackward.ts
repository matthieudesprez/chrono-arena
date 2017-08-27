module TacticArena.Action.Timeline {
    export class GoBackward extends BaseAction {

        constructor() {
            super('go backward');
        }

        static process(state) {
            if(state.resolveManager.active && !state.resolveManager.processing) {
                state.isPaused = true;
                let previousIndex = state.resolveManager.currentIndex -1;
                if(previousIndex >= 0) {
                    state.resolveManager.processSteps(previousIndex, true, true);
                }
            }
        }
    }
}
