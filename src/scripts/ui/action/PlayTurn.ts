module TacticArena.Action {
    export class PlayTurn extends BaseAction {

        constructor() {
            super('play turn');
        }

        static process(state: State.BaseBattle, index?: number): void {
            Action.EndChampionTurn.process(state, null);
            state.uiManager.timelineMenu.clean();
            state.initResolvePhase(state.logManager.logs[index], index);
        }
    }
}
