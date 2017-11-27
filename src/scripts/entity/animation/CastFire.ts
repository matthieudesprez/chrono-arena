module TacticArena.Animation {
    export class CastFire extends BaseAnimation {

        constructor(state:State.BasePlayable, pawn:Entity.Pawn, order:BaseOrder) {
            super(state, pawn, order);
        }

        get():Promise<any> {
            let self = this;
            let animation = new Promise((resolve, reject) => {
                this.state.spritesManager.showReal(this.pawn);
                let sprite = this.state.spritesManager.getReal(this.pawn);
                sprite.cast(this.order.direction).then( () => {
                    let fireball = self.state.pawnsSpritesGroup.add(new FX.FireBall(self.state, sprite.getRawPosition(), sprite.getDirection()));
                    self.order.targets.forEach( target => {
                        let pawn = (self.state as State.BaseBattle).orderManager.getPawn(target);
                        self.state.spritesManager.getReal(pawn).hurtAnimation();
                        self.state.spritesManager.getReal(pawn).hurtText(2);
                    });
                    return fireball.playDefault();
                }).then( () => {
                    resolve(true);
                });
            });
            return super.handleBackward(animation);
        }
    }
}
