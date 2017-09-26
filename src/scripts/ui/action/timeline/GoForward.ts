module TacticArena.Action.Timeline {
    export class GoForward extends BaseAction {

        constructor() {
            super('go forward');
        }

        static process(state) {
            if(state.resolveManager.active && !state.resolveManager.processing) {
                let nextIndex = state.resolveManager.currentIndex + 1;
                if(nextIndex >= state.resolveManager.steps.length) {
                    state.isPaused = false;
                }
                state.resolveManager.processSteps(nextIndex);
            }
        }
    }
}
