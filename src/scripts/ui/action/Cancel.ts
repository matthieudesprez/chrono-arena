module TacticArena.Action {
    export class Cancel extends BaseAction {

        constructor() {
            super('cancel');
        }

        static process(state) {
            if(!state.process) {
                var activePawn = state.turnManager.getActivePawn();
                activePawn.show();
                activePawn.destroyProjection();
                activePawn.setAp(3);
                activePawn.getProjectionOrReal().faceDirection(state.uiManager.actionMenu.savedDirection);
                state.uiManager.actionMenu.initDirection(state.uiManager.actionMenu.savedDirection);
                state.orderManager.removeEntityOrder(activePawn);
                state.signalManager.onActionPlayed.dispatch(activePawn);
            }
        }
    }
}
