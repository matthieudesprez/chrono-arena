/// <reference path="Skill.ts"/>
module TacticArena.Skill {
    export class Heal extends TacticArena.Skill.LinearSkill {

        constructor(state, pawn) {
            super(state, pawn);
            this.id = 'heal';
            this.name = 'Heal';
            this.minCost = 1;
            this.range = 1;
            this.pathColor = null;
        }

        onOrder(position, direction) {
            this.state.spritesManager.getProjectionOrReal(this.pawn, true).halfcast(direction);
            this.state.orderManager.add(this.pawn, new Order.Heal(position, direction));
        }
    }
}
