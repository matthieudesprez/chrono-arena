module TacticArena.Animation {
    export class CastWind extends BaseCast {

        getCastCallback(): Promise<any> {
            let self = this;
            let sprite = this.state.spritesManager.getReal(this.pawn);
            let tornado = this.state.pawnsSpritesGroup.add(new FX.Tornado(this.state, sprite.getRawPosition(), sprite.getDirection()));
            this.order.targets.forEach(target => {
                let pawn = (this.state as State.BaseBattle).getChampion(target.champion);
                let movedDistance = target.distance * 100;
                setTimeout(function () {
                    self.state.spritesManager.getReal(pawn).hurtAnimation();
                    self.state.spritesManager.getReal(pawn).hurtText(1);
                    if (target.moved) {
                        self.state.spritesManager.getReal(pawn).moveTo(target.moved.x, target.moved.y, [], true, false, false);
                    }
                }, movedDistance);
            });
            return tornado.playDefault();
        }
    }
}
