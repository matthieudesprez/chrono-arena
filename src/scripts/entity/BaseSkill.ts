module TacticArena.Entity {
    export class BaseSkill {
        state;
        pawn;
        id;
        name;
        description;
        icon;
        minCost;
        selected;

        constructor(state, pawn) {
            this.state = state;
            this.pawn = pawn;
            this.id = '';
            this.name = '';
            this.description = '';
            this.icon = null;
            this.minCost = 0;
            this.selected = false;
        }

        canOrder() {
            return this.selected && this.pawn.getAp() >= this.minCost;
        }

        updateUI() {

        }

        order() {

        }
    }
}
