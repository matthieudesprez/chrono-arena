module TacticArena.Action {
    export class ConfirmResolve extends BaseAction {

        constructor() {
            super('confirm resolve');
        }

        static process(state) {
            state.spritesManager.destroyAllProjections();
            state.resolveManager.active = false;
            //setTimeout(function() {
                //state.uiManager.notificationsUI.clean();
            //}, 500);
            state.uiManager.timelineMenu.clean();
            if(state.isOver()) {
                state.battleOver(state.teams[state.playerTeam] ? 'You win' : 'You lose');
            } else {
                state.uiManager.initOrderPhase(state.getFirstAlive(), true);
            }
        }
    }
}
