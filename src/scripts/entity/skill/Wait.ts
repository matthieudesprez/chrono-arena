module TacticArena.Entity.Skill {
    export class Wait extends TacticArena.Entity.BaseSkill {

        constructor(state, pawn) {
            super(state, pawn);
            this.id = 'wait';
            this.name = 'Wait';
            this.description = 'Cost: 1 AP / tile; Hit: 50%';
            this.icon = this.state.make.sprite(0, 0, 'icon-wait');
            this.minCost = 1;
        }

        order() {
            let position = this.pawn.getProjectionOrReal().getPosition();
            this.state.orderManager.add('stand', this.pawn, position.x, position.y, this.pawn.getProjectionOrReal().getDirection());
            this.pawn.setAp(this.pawn.getAp() - 1);
            this.state.signalManager.onActionPlayed.dispatch(this.pawn);
        }
    }
}
