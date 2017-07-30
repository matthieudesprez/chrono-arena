module TacticArena.UI {
    export class Action {
        menu;
        element;

        constructor(menu) {
            this.menu = menu;
            this.menu.element.append();
            this.element = this.menu.element.find('.ui-menu');

            //TODO WAIT
            //let activePawn = this.menu.game.turnManager.getActivePawn();
            //let position = activePawn.getProjectionOrReal().getPosition();
            //this.menu.game.orderManager.add('stand', activePawn, position.x, position.y, activePawn.getProjectionOrReal().getDirection());
            //activePawn.setAp(activePawn.getAp() - 1);
            //this.menu.game.signalManager.onActionPlayed.dispatch(activePawn);
        }
    }
}
