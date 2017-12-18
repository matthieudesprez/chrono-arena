module TacticArena.Action {
    export class EndChampionTurn extends BaseAction {

        constructor() {
            super('end order');
        }

        static process(state: State.BaseBattle, nextPawn?: Champion.BaseChampion): void {
            state.process = true;
            state.selecting = false;
            // in case of a local multiplayer, the projections can be hidden
            if(!!nextPawn && nextPawn.team !== state.turnManager.currentPawn.team && state.hideProjections) {
                state.spritesManager.destroyAllProjections();
            }
            state.stageManager.clearHelp();
            state.uiManager.ordersnotificationsUI.clean();
            state.uiSpritesGroup.removeAll();
            if(state.uiManager.actionMenu) {
                state.uiManager.actionMenu.clean();
                state.uiManager.actionMenu = null;
            }
        }
    }
}
