/// <reference path="LinearSkill.ts"/>
module TacticArena.Skill {
    export class Fire extends LinearSkill {

        constructor(state, pawn) {
            super(state, pawn);
            this.id = 'fire';
            this.name = 'Fire';
            this.description = 'Cost: 2 AP; Range 4; Hit: 100%';
            this.minCost = 2;
            this.range = 4;
        }

        onOrder(position): void {
            this.state.spritesManager.getProjectionOrReal(this.pawn, true).halfcast(position.d);
            this.state.orderManager.add(this.pawn, new Order.Fire(position));
        }
    }
}
