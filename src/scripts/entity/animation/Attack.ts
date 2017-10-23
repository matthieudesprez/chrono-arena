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
            let that = this;
            let target = this.targets[0];
            let animation =  new Promise((resolve, reject) => {
                if(this.order.direction) {
                    this.pawn.faceDirection(this.order.direction);
                }
                this.state.spritesManager.sprites[this.pawn._id].attack(() => {
                    resolve(true);
                    that.state.spritesManager.sprites[that.pawn._id].stand();
                    return true;
                }).then( () => {
                    if (target.dodge) {
                        target.entity.dodge();
                    } else {
                        target.entity.hurt(target.damages);
                    }
                    resolve(true);
                });
            });
            return super.handleBackward(animation);
        }
    }
}
