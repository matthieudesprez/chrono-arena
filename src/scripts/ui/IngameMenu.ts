module TacticArena.UI {
    export class IngameMenu {
        menu;
        element;
        dialogUI;
        active;

        constructor(menu) {
            this.menu = menu;
            this.active = false;

            this.dialogUI = new UI.Dialog(this.menu.game);

            let icon = this.menu.game.make.image(this.menu.game.world.width - 43, 8, 'icon-menu4');
            this.menu.game.uiGroup.add(icon);

            icon.inputEnabled = true;
            icon.events.onInputDown.add(this.open, this);

            //this.open();
        }

        showOverlay() {

        }

        gameOver(msg) {

        }

        show(msg) {

        }

        close() {
            this.active = false;
        }

        open() {
            this.active = true;
            this.dialogUI.showModal("modal1");
        }
    }
}
