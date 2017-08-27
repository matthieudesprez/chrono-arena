module TacticArena.UI {
    export class UIManager {
        game;
        element;
        pawnsinfosUI;
        keyManager;
        ordersnotificationsUI;
        transitionUI;
        turnIndicatorUI;
        ingamemenuUI;
        process;
        actionMenu;
        topMenu;
        timelineMenu;

        constructor(game) {
            var self = this;
            this.game = game;

            this.element = $('#content');

            this.actionMenu = null;
            this.timelineMenu = null;
            this.topMenu = new UI.TopMenu(this.game);

            this.pawnsinfosUI = new UI.PawnsInfos(this);
            this.keyManager = new UI.KeyManager(this);
            this.ordersnotificationsUI = new UI.OrdersNotifications(this);
            this.transitionUI = new UI.Transition(this);
            this.turnIndicatorUI = new UI.TurnIndicator(this);
            this.ingamemenuUI = new UI.IngameMenu(this);


            this.process = false;
        }

        initOrderPhase(pawn, first) {
            if(first) {
                this.game.orderManager.orders = [];
            }
            this.game.turnManager.init(pawn, first).then( data => {
                if(first) {
                    this.turnIndicatorUI.write(this.game.turnManager.currentTurnIndex + 1);
                    return this.transitionUI.show('Phase de commandement');
                }
                return true;
            }).then( res => {
                this.game.signalManager.turnInitialized.dispatch(pawn);
            });
        }

        initResolvePhase(steps) {
            this.game.resolveManager.init(steps);
            this.transitionUI.show('Phase de Résolution').then((res) => {
                return true;
            }).then( res => {
                this.timelineMenu = new TimelineMenu(this.game);
                return this.timelineMenu.init(<any>steps.length);
            }).then( res => {
                console.log('oki');
                this.game.resolveManager.processSteps(0);
            });
        }

        isOver() {
            return (this.actionMenu && this.actionMenu.isOver) ||
                (this.timelineMenu && this.timelineMenu.isOver) ||
                this.topMenu.isOver;
        }
    }
}
