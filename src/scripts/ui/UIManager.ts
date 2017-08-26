module TacticArena.UI {
    export class UIManager {
        game;
        element;
        timeUI;
        timelineUI;
        pawnsinfosUI;
        keyManager;
        ordersnotificationsUI;
        transitionUI;
        turnIndicatorUI;
        ingamemenuUI;
        process;
        actionMenu;
        topMenu;

        constructor(game) {
            var self = this;
            this.game = game;

            this.element = $('#content');

            this.actionMenu = null;
            this.topMenu = new UI.TopMenu(this.game);

            this.timeUI = new UI.Time(this);
            this.timelineUI = new UI.TimeLine(this);
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
            this.game.turnManager.init(pawn, first).then((data) => {
                if(first) {
                    this.turnIndicatorUI.write(this.game.turnManager.currentTurnIndex + 1);
                    this.transitionUI.show('Phase de commandement').then( (res) => {
                        return true;
                    });
                }
                this.game.signalManager.turnInitialized.dispatch(pawn);
            });
        }

        initResolvePhase(steps) {
            this.ingamemenuUI.close();
            this.game.resolveManager.init(steps);
            this.transitionUI.show('Phase de Résolution').then((res) => {
                return true;
            }).then((res) => {
                this.pawnsinfosUI.selectAll();
                this.game.logManager.add(steps);
                this.timelineUI.build(<any>steps.length).then((res) => {
                    this.game.resolveManager.processSteps(0);
                });
            });
        }

        isOver() {
            return (this.actionMenu && this.actionMenu.isOver) || this.topMenu.isOver;
        }
    }
}
