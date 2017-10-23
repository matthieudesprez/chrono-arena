module TacticArena.Action {
    export class Cancel extends BaseAction {

        constructor() {
            super('cancel');
        }

        static process(state) {
            if(!state.process) {
                var activePawn = state.turnManager.getActivePawn();
                activePawn.setAp(activePawn._apMax);
                state.spritesManager.show(activePawn);
                state.spritesManager.destroyProjection(activePawn);
                state.spritesManager.sprites[activePawn._id].stand(state.uiManager.actionMenu.savedDirection);
                state.uiManager.actionMenu.skillDeselectAll();
                state.orderManager.removeEntityOrder(activePawn);
                state.signalManager.onActionPlayed.dispatch(activePawn);
            }
        }
    }
}
