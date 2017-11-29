module TacticArena.Action {
    export class ConfirmOrder extends BaseAction {

        constructor() {
            super('confirm order');
        }

        static process(state: State.BaseBattle): void {
            if (!state.process) {
                state.process = true;
                state.selecting = false;
                state.turnManager.endTurn().then((nextPawn) => {
                    state.signalManager.onTurnEnded.dispatch(nextPawn);
                    if(state.playMode == 'online' && !nextPawn) { // if no more playable pawns to play
                        state.serverManager.request('VALID_ORDER_PHASE', {
                            turn: state.turnManager.currentTurnIndex,
                            orders: state.orderManager.getPlayerOrders(state.getPlayablePlayers())
                        }); // end order phase and send orders to server
                        state.uiManager.ingamemenuUI.show('Waiting for opponent move');
                    } else {
                        if (!nextPawn) {
                            state.initResolvePhase(state.orderManager.getSteps());
                        } else {
                            state.initOrderPhase(nextPawn, false);
                        }
                    }
                });
            }
        }
    }
}
