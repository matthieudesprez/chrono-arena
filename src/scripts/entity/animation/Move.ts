module TacticArena.Animation {
    export class Move extends BaseAnimation {
        previousStepUnit: StepUnit;
        animate: boolean;

        constructor(state: State.BasePlayable, stepUnit: StepUnit, previousStepUnit: StepUnit, animate: boolean) {
            super(state, stepUnit);
            this.previousStepUnit = (previousStepUnit !== null) ? previousStepUnit : stepUnit;
            this.animate = animate;
        }

        async get(): Promise<any> {
            //await this.handleBackward(new Animation.Stand(this.state, this.previousStepUnit).get());
            await this.state.spritesManager.getReal(this.stepUnit.pawn).moveTo(this.stepUnit.order.position.x, this.stepUnit.order.position.y, null, this.animate);
            return new Animation.Stand(this.state, this.stepUnit).get();
        }
    }
}
