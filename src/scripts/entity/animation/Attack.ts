module TacticArena.Animation {
    export class Attack extends BaseAnimation {
        state;
        targets;

        constructor(pawn:Entity.Pawn, order:BaseOrder, position:Position, state) {
            super(pawn, order, position);
            this.targets = [];
            // TODO voué à disparaître
            this.state = state;
            this.order.targets.forEach( t => {
                t.entity = this.state.orderManager.getPawn(t.entityId);
                this.targets.push(t);
            });
        }

        get():Promise<any> {
            let animation = this.pawn.attack(this.targets[0], this.order.direction).then((res) => {
                return res;
            });
            return super.handleBackward(animation);
        }
    }
}
