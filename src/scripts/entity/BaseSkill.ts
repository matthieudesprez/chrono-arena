module TacticArena.Entity {
    export class BaseSkill {
        state;
        pawn;
        id;
        name;
        description;
        icon;
        minCost;
        range;

        constructor(state, pawn) {
            this.state = state;
            this.pawn = pawn;
            this.id = '';
            this.name = '';
            this.description = '';
            this.icon = null;
            this.minCost = 0;
            this.range = 0;
        }

        canOrder() {
            return this.pawn.getAp() >= this.minCost;
        }

        updateUI() {

        }

        cleanUI() {

        }

        order() {

        }

        onDeselect() {

        }

        onSelect() {

        }
    }
}
