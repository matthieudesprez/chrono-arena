/// <reference path="BaseSkill.ts"/>
module TacticArena.Entity.Skill {
    export class Watch extends TacticArena.Entity.Skill.LinearSkill {

        constructor(state, pawn) {
            super(state, pawn);
            this.id = 'watch';
            this.name = 'Watch';
            this.description = 'Cost: 1 AP / tile; Hit: 50%';
            this.minCost = 1;
            this.range = 1;
        }

        onOrder(position, direction) {
            this.pawn.getProjectionOrReal(true).faceDirection(direction);
            //this.pawn.getProjectionOrReal().getSprite().attack();
            //this.state.orderManager.add(this.pawn, new Order.Watch(position, direction));
        }
    }
}
