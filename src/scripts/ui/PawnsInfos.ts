module TacticArena.UI {
    export class PawnsInfos {
        menu;
        element;

        constructor(menu) {
            var self = this;
            this.menu = menu;
            this.element = this.menu.element.querySelector('.ui-pawns-infos');
        }

        select(id) {
            this.deselectAll();
            this.element.querySelector('.pawn0' + id).classList.add('active');
        }

        deselectAll() {
            var avatars = this.element.querySelectorAll('.pawn');
            for(var i=0; i < avatars.length; i++) {
                avatars[i].classList.remove('active');
            }
        }

    }
}
