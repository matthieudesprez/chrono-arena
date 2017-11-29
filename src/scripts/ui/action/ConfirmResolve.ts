module TacticArena.Action {
    export class ConfirmResolve extends BaseAction {

        constructor() {
            super('confirm resolve');
        }

        static process(state) {
            state.spritesManager.destroyAllProjections();
            state.resolveManager.active = false;
            state.uiManager.timelineMenu.clean();
            if(state.isOver()) {
                state.battleOver();
            } else {
                state.turnManager.reset();
                state.initOrderPhase(state.turnManager.getNextPawn(), true); // start next turn
            }
        }
    }
}
