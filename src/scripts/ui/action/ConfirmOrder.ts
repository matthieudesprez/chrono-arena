module TacticArena.Action {
    export class ConfirmOrder extends BaseAction {

        constructor() {
            super('confirm order');
        }

        static process(state: State.BaseBattle): void {
            if (!state.process) {
                state.turnManager.endTurn().then((nextPawn) => {
                    Action.EndChampionTurn.process(state, nextPawn);
                    if(state.playMode == 'online' && !nextPawn) { // if no more playable pawns to play
                        state.serverManager.request('VALID_ORDER_PHASE', {
                            turn: state.logManager.logs.length - 1,
                            orders: state.orderManager.orders
                        }); // end order phase and send orders to server
                        state.uiManager.ingamemenuUI.show('Waiting for opponent move');
                    } else {
                        if (!nextPawn) {
                            let steps = state.orderManager.getSteps();
                            state.logManager.add(steps);
                            state.initResolvePhase(steps);
                        } else {
                            state.initOrderPhase(nextPawn, false);
                        }
                    }
                });
            }
        }
    }
}
