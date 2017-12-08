module TacticArena.Animation {
    export abstract class BaseCast extends BaseAnimation {
        speed;

        constructor(state: State.BasePlayable, pawn: Champion.BaseChampion, order: Order.BaseOrder, stepUnit: StepUnit, speed: number = 1000) {
            super(state, pawn, order, stepUnit);
            this.speed = speed;
        }

        async get(): Promise<any> {
            this.state.spritesManager.showReal(this.pawn);
            await super.handleBackward(this.state.spritesManager.getReal(this.pawn).cast(this.order.position.d, this.speed));
            return super.handleBackward(this.getCastCallback());
        }

        getCastCallback(): Promise<any> {
            return new Promise((resolve, reject) => {
                resolve(true);
            });
        }
    }
}
