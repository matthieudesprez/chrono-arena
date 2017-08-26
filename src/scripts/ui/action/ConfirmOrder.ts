module TacticArena.Action {
    export class ConfirmOrder extends BaseAction {

        constructor() {
            super('confirm order');
        }

        static process(state) {
            if (!state.process) {
                state.process = true;
                state.selecting = false;
                state.stageManager.clearPossibleMove();
                state.stageManager.clearPath(state.pathTilesGroup);
                let activePawn = state.turnManager.getActivePawn();
                state.turnManager.endTurn().then((nextPawn) => {
                    state.signalManager.onTurnEnded.dispatch(activePawn);
                    if(state.playMode == 'online' && state.turnManager.getRemainingPawns(state.playerTeam).length == 0) {
                        // s'il reste plus de pawn à jouer du playerteam
                        // alors on signale au serveur qu'on a fini la phase de commandement
                        // en lui envoyant les ordres
                        state.serverManager.request('VALID_ORDER_PHASE', {
                            turn: state.turnManager.currentTurnIndex,
                            orders: state.orderManager.getPlayerOrders(state.playerTeam)
                        });
                        state.uiManager.ingamemenuUI.show('Waiting for opponent move');
                    } else {
                        if (state.turnManager.getRemainingPawns().length == 0) {
                            let steps = state.orderManager.getSteps();
                            state.uiManager.initResolvePhase(steps);
                        } else {
                            state.uiManager.initOrderPhase(nextPawn, false);
                        }
                    }
                });
            }
        }
    }
}
