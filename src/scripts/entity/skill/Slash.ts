/// <reference path="Skill.ts"/>
module TacticArena.Skill {
    export class Slash extends TacticArena.Skill.LinearSkill {

        constructor(state, pawn) {
            super(state, pawn);
            this.id = 'slash';
            this.name = 'Slash';
            this.description = 'Cost: 1 AP; Range 1; Hit: 100%';
            this.minCost = 1;
            this.range = 1;
        }

        onOrder(position, direction) {
            this.state.spritesManager.createProjection(this.pawn);
            this.state.spritesManager.getProjectionOrReal(this.pawn, true).attack(direction);
            this.state.orderManager.add(this.pawn, new Order.Slash(position, direction));
        }
    }
}