module TacticArena.Animation {
    export class Attack extends BaseAnimation {
        targets;

        constructor(state:State.BasePlayable, pawn:Entity.Pawn, order:BaseOrder, position:Position) {
            super(state, pawn, order, position);
            this.targets = [];
            this.order.targets.forEach( t => {
                t.entity = this.state.orderManager.getPawn(t.entityId);
                this.targets.push(t);
            });
        }

        get():Promise<any> {
            let that = this;
            let target = this.targets[0];
            let animation =  new Promise((resolve, reject) => {
                if(this.order.direction) {
                    this.pawn.changeDirection(this.order.direction);
                }
                this.state.spritesManager.getReal(this.pawn).attack(this.order.direction, () => {
                    that.state.spritesManager.getReal(this.pawn).stand();
                    resolve(true);
                }).then( () => {
                    if (target.dodge) {
                        that.state.spritesManager.getReal(this.pawn).displayText('miss');
                    } else {
                        this.state.spritesManager.destroyProjection(this.pawn);
                        target.entity.hurt(target.damages);
                    }
                    resolve(true);
                });
            });
            return super.handleBackward(animation);
        }
    }
}
