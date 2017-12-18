module TacticArena.Animation {
    export class CastFire extends BaseCast {

        constructor(state: State.BasePlayable, stepUnit: StepUnit) {
            super(state, stepUnit, 500);
        }

        getCastCallback(): Promise<any> {
            let sprite = this.state.spritesManager.getReal(this.stepUnit.pawn);
            let fireball = this.state.pawnsSpritesGroup.add(new FX.FireBall(this.state, sprite.getRawPosition(), sprite.getDirection()));
            this.stepUnit.order.targets.forEach(target => {
                let pawn = (this.state as State.BaseBattle).getChampion(target.championId);
                this.state.spritesManager.getReal(pawn).hurtAnimation();
                this.state.spritesManager.getReal(pawn).hurtText(2);
            });
            return fireball.playDefault();
        }
    }
}
