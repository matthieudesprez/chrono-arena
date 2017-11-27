module TacticArena.Animation {
    export class CastHeal extends BaseAnimation {

        constructor(state:State.BasePlayable, pawn:Entity.Pawn, order:BaseOrder) {
            super(state, pawn, order);
        }

        get():Promise<any> {
            let self = this;
            let animation = new Promise((resolve, reject) => {
                this.state.spritesManager.showReal(this.pawn);
                let sprite = this.state.spritesManager.getReal(this.pawn);
                sprite.cast(this.order.direction).then( () => {
                    self.order.targets.forEach( target => {
                        let pawn = (self.state as State.BaseBattle).orderManager.getPawn(target);
                        self.state.spritesManager.getReal(pawn).healAnimation();
                        self.state.spritesManager.getReal(pawn).healText(1);
                    });
                    resolve(true);
                });
            });
            return super.handleBackward(animation);
        }
    }
}
