module TacticArena.Animation {
    export class CastFire extends BaseCast {

        constructor(state: State.BasePlayable, pawn: Champion.BaseChampion, order: Order.BaseOrder, stepUnit: StepUnit) {
            super(state, pawn, order, stepUnit, 500);
        }

        getCastCallback(): Promise<any> {
            let sprite = this.state.spritesManager.getReal(this.pawn);
            let fireball = this.state.pawnsSpritesGroup.add(new FX.FireBall(this.state, sprite.getRawPosition(), sprite.getDirection()));
            this.order.targets.forEach(target => {
                let pawn = (this.state as State.BaseBattle).getChampion(target.championId);
                this.state.spritesManager.getReal(pawn).hurtAnimation();
                this.state.spritesManager.getReal(pawn).hurtText(2);
            });
            return fireball.playDefault();
        }
    }
}
