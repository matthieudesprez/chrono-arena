/// <reference path="BaseSkill.ts"/>
module TacticArena.Entity.Skill {
    export class Wind extends TacticArena.Entity.Skill.LinearSkill {

        constructor(state, pawn) {
            super(state, pawn);
            this.id = 'wind';
            this.name = 'Wind';
            this.description = 'Cost: 2 AP; Range 4; Push 1 tile; Hit: 100%';
            this.minCost = 2;
            this.range = 4;
        }

        onOrder(position, direction) {
            this.pawn.getProjectionOrReal(true).halfcast(direction);
            this.state.orderManager.add(this.pawn, new Order.Wind(position, direction));
        }
    }
}
