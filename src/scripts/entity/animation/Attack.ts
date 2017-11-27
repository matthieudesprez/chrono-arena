module TacticArena.Animation {
    export class Attack extends BaseAnimation {
        targets;

        constructor(state:State.BasePlayable, pawn:Entity.Pawn, order:BaseOrder) {
            super(state, pawn, order);
            this.targets = [];
            this.order.targets.forEach( target => {
                //TODO create class Target { id: int, pawn: Pawn}
                (target as any).entity = (this.state as State.BaseBattle).orderManager.getPawn(target.entityId);
                this.targets.push(target);
            });
        }

        get():Promise<any> {
            let that = this;
            let target = this.targets[0];
            let animation =  new Promise((resolve, reject) => {
                this.state.spritesManager.getReal(this.pawn).stand(this.order.direction);
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
