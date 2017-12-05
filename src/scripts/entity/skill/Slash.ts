module TacticArena.Skill {
    export class Slash extends LinearSkill {

        constructor(state, pawn) {
            super(state, pawn);
            this.id = 'slash';
            this.name = 'Slash';
            this.description = 'Cost: 1 AP; Range 1; Hit: 100%';
            this.minCost = 1;
            this.range = 1;
        }

        onOrder(position) {
            this.state.spritesManager.createProjection(this.pawn);
            this.state.spritesManager.getProjectionOrReal(this.pawn, true).attack(position.d);
            this.state.orderManager.add(this.pawn, new Order.Slash(position));
        }
    }
}