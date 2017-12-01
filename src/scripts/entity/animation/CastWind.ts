module TacticArena.Animation {
    export class CastWind extends BaseCast {

        getCastCallback(): Promise<any> {
            let self = this;
            let sprite = this.state.spritesManager.getReal(this.pawn);
            let tornado = this.state.pawnsSpritesGroup.add(new FX.Tornado(this.state, sprite.getRawPosition(), sprite.getDirection()));
            this.order.targets.forEach(target => {
                let pawn = (this.state as State.BaseBattle).orderManager.getPawn(target.champion);
                let movedDistance = target.moved !== null ? target.moved.d * 100 : 0;
                setTimeout(function () {
                    self.state.spritesManager.getReal(pawn).hurtAnimation();
                    self.state.spritesManager.getReal(pawn).hurtText(1);
                    if (target.moved) {
                        self.state.spritesManager.getReal(pawn).moveTo(target.moved.x, target.moved.y);
                    }
                }, movedDistance);
            });
            return tornado.playDefault();
        }
    }
}
