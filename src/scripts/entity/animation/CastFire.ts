module TacticArena.Animation {
    export class CastFire extends BaseCast {

        getCastCallback(): Promise<any> {
            let sprite = this.state.spritesManager.getReal(this.pawn);
            let fireball = this.state.pawnsSpritesGroup.add(new FX.FireBall(this.state, sprite.getRawPosition(), sprite.getDirection()));
            this.order.targets.forEach(target => {
                let pawn = (this.state as State.BaseBattle).orderManager.getPawn(target);
                this.state.spritesManager.getReal(pawn).hurtAnimation();
                this.state.spritesManager.getReal(pawn).hurtText(2);
            });
            return fireball.playDefault();
        }
    }
}
