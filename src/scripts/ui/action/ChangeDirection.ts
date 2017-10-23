module TacticArena.Action {
    export class ChangeDirection extends BaseAction {

        constructor() {
            super('change direction');
        }

        static process(state, direction?) {
            let matching = {'N': 'north', 'E': 'east', 'S': 'south', 'W': 'west'};
            let activePawn = state.turnManager.getActivePawn();

            if(!state.process && activePawn.getAp() > 0) {
                activePawn.createProjection();
                state.spritesManager.getProjectionOrReal(activePawn, true).stand(direction);
                //let position = activePawn.getProjectionOrReal().getPosition();
                //this.menu.game.orderManager.add('stand', activePawn, position.x, position.y, direction);
                //activePawn.setAp(activePawn.getAp() - 1);
                //this.menu.game.signalManager.onActionPlayed.dispatch(activePawn);
                //this.select(matching[direction]);
            }
        }
    }
}
