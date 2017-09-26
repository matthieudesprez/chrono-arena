module TacticArena.UI {
    export class UIManager {
        game;
        keyManager;
        ordersnotificationsUI;
        transitionUI;
        turnIndicatorUI;
        modeIndicator;
        ingamemenuUI;
        process;
        actionMenu;
        topMenu;
        timelineMenu;

        constructor(game) {
            this.game = game;

            this.actionMenu = null;
            this.timelineMenu = null;

            this.topMenu = new UI.TopMenu(this.game);
            this.turnIndicatorUI = new UI.TurnIndicator(this);
            this.modeIndicator = new UI.ModeIndicator(this);
            this.ingamemenuUI = new UI.IngameMenu(this);

            this.keyManager = new UI.KeyManager(this);

            this.ordersnotificationsUI = new UI.OrdersNotifications(this);
            this.transitionUI = new UI.Transition(this);

            this.process = false;
        }

        initOrderPhase(pawn, first) {
            if(first) {
                this.game.orderManager.orders = [];
            }
            this.game.turnManager.init(pawn, first).then( data => {
                if(first) {
                    this.turnIndicatorUI.write(this.game.turnManager.currentTurnIndex + 1);
                    return this.transitionUI.show('PLAN');
                }
                return true;
            }).then( res => {
                this.game.signalManager.turnInitialized.dispatch(pawn);
            });
        }

        initResolvePhase(steps) {
            this.game.resolveManager.init(steps);
            this.transitionUI.show('EXECUTION').then((res) => {
                return res;
            }).then((res) => {
                this.timelineMenu = new TimelineMenu(this.game);
                return this.timelineMenu.init(<any>steps.length);
            }).then( res => {
                this.game.resolveManager.processSteps(0);
            });
        }

        isOver() {
            return (this.actionMenu && this.actionMenu.isOver) ||
                (this.timelineMenu && this.timelineMenu.isOver) ||
                this.topMenu.isOver ||
                this.ingamemenuUI.active;
        }
    }
}
