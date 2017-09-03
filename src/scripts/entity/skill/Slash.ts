/// <reference path="BaseSkill.ts"/>
module TacticArena.Entity.Skill {
    export class Slash extends TacticArena.Entity.Skill.LinearSkill {

        constructor(state, pawn) {
            super(state, pawn);
            this.id = 'slash';
            this.name = 'Slash';
            this.description = 'Cost: 1 AP; Range 1; Hit: 100%';
            this.minCost = 1;
            this.range = 1;
        }

        onOrder(position, direction) {
            this.pawn.getProjectionOrReal(true).faceDirection(direction);
            this.pawn.getProjectionOrReal().getSprite().attack();
            this.state.orderManager.add(this.pawn, new Order.Slash(position, direction));
        }
    }
}