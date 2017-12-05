module TacticArena.Skill {
    export class Wind extends LinearSkill {

        constructor(state, pawn) {
            super(state, pawn);
            this.id = 'wind';
            this.name = 'Wind';
            this.description = 'Cost: 2 AP; Range 4; Push 1 tile; Hit: 100%';
            this.minCost = 2;
            this.range = 4;
        }

        onOrder(position) {
            this.state.spritesManager.getProjectionOrReal(this.pawn, true).halfcast(position.d);
            this.state.orderManager.add(this.pawn, new Order.Wind(position));
        }
    }
}
