module TacticArena.UI {
    export class UIManager {
        game;
        keyManager;
        ordersnotificationsUI;
        transitionUI;
        turnIndicatorUI;
        ingamemenuUI;
        actionMenu;
        topMenu;
        timelineMenu;
        dialogUI;
        modalUI;

        constructor(game) {
            this.game = game;

            this.actionMenu = null;
            this.timelineMenu = null;

            this.dialogUI = new UI.Dialog(this.game);
            this.modalUI = new UI.Modal(this.game);
            this.topMenu = new UI.TopMenu(this.game);
            this.turnIndicatorUI = new UI.TurnIndicator(this);
            this.ingamemenuUI = new UI.IngameMenu(this);
            this.keyManager = new UI.KeyManager(this);

            this.ordersnotificationsUI = new UI.OrdersNotifications(this);
            this.transitionUI = new UI.Transition(this);
        }

        mouseOver() {
            return this.ingamemenuUI.active;
        }
    }
}
