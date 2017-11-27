module TacticArena.Animation {
    export class CastWind extends BaseAnimation {

        constructor(state:State.BasePlayable, pawn:Entity.Pawn, order:BaseOrder) {
            super(state, pawn, order);
        }

        get():Promise<any> {
            let self = this;
            let animation = new Promise((resolve, reject) => {
                this.state.spritesManager.showReal(this.pawn);
                let sprite = this.state.spritesManager.getReal(this.pawn);
                sprite.cast(this.order.direction).then( () => {
                    let tornado = self.state.pawnsSpritesGroup.add(new FX.Tornado(self.state, sprite.getRawPosition(), sprite.getDirection()));
                    self.order.targets.forEach( target => {
                        let pawn = (this.state as State.BaseBattle).orderManager.getPawn(target.entity);
                        setTimeout( function() {
                            self.state.spritesManager.getReal(pawn).hurtAnimation();
                            self.state.spritesManager.getReal(pawn).hurtText(1);
                            if(target.moved) {
                                self.state.spritesManager.getReal(pawn).moveTo(target.moved.x, target.moved.y);
                            }
                        }, target.moved.d * 100);
                    });
                    return tornado.playDefault();
                }).then( () => {
                    resolve(true);
                });
            });
            return super.handleBackward(animation);
        }
    }
}
