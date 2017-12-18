module TacticArena.Animation {
    export abstract class BaseCast extends BaseAnimation {
        speed;

        constructor(state: State.BasePlayable, stepUnit: StepUnit, speed: number = 1000) {
            super(state, stepUnit);
            this.speed = speed;
        }

        async get(): Promise<any> {
            this.state.spritesManager.showReal(this.stepUnit.pawn);
            await super.handleBackward(this.state.spritesManager.getReal(this.stepUnit.pawn).cast(this.stepUnit.order.position.d, this.speed));
            return super.handleBackward(this.getCastCallback());
        }

        getCastCallback(): Promise<any> {
            return new Promise((resolve, reject) => {
                resolve(true);
            });
        }
    }
}
