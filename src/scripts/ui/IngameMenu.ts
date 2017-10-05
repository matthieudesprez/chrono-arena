module TacticArena.UI {
    export class IngameMenu {
        menu;
        element;
        active;

        constructor(menu) {
            this.menu = menu;
            this.active = false;
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
            this.menu.dialogUI.hideModal("modal1");
        }

        open() {
            this.active = true;
            this.menu.dialogUI.showModal("modal1");
        }
    }
}
