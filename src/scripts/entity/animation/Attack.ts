module TacticArena.Animation {
    export class Attack extends BaseAnimation {

        constructor(state:State.BasePlayable, pawn:Entity.Pawn, order:BaseOrder) {
            super(state, pawn, order);
        }

        get():Promise<any> {
            let self = this;
            let animation =  new Promise((resolve, reject) => {
                this.state.spritesManager.getReal(this.pawn).stand(this.order.direction);
                this.state.spritesManager.getReal(this.pawn).attack(this.order.direction).then( () => {
                    this.order.targets.forEach( target => {
                        let pawn = (this.state as State.BaseBattle).orderManager.getPawn(target.entityId);
                        if (target.dodge) {
                            self.state.spritesManager.getReal(pawn).displayText('miss');
                        } else {
                            self.state.spritesManager.getProjectionOrReal(pawn).hurtAnimation();
                            self.state.spritesManager.getProjectionOrReal(pawn).hurtText(target.damages);
                        }
                    });
                    resolve(true);
                });
            });
            return super.handleBackward(animation);
        }
    }
}
