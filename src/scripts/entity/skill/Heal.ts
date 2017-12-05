/// <reference path="LinearSkill.ts"/>
module TacticArena.Skill {
    export class Heal extends LinearSkill {

        constructor(state, pawn) {
            super(state, pawn);
            this.id = 'heal';
            this.name = 'Heal';
            this.minCost = 1;
            this.range = 1;
            this.pathColor = null;
        }

        onOrder(position) {
            this.state.spritesManager.getProjectionOrReal(this.pawn, true).halfcast(position.d);
            this.state.orderManager.add(this.pawn, new Order.Heal(position));
        }
    }
}
