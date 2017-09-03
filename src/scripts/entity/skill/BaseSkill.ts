module TacticArena.Entity.Skill {
    export class BaseSkill {
        state;
        pawn;
        id;
        name;
        description;
        minCost;
        range;

        constructor(state, pawn) {
            this.state = state;
            this.pawn = pawn;
            this.id = '';
            this.name = '';
            this.description = '';
            this.minCost = 0;
            this.range = 0;
        }

        canOrder() {
            return this.pawn.getAp() >= this.minCost;
        }

        updateUI(position) {

        }

        cleanUI() {

        }

        order(target) {

        }

        onDeselect() {

        }

        onSelect() {

        }
    }
}
