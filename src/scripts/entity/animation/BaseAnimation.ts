module TacticArena.Animation {
    export abstract class BaseAnimation {
        state: State.BasePlayable; // reference to current state, BasePlayable because can be played outside a battle
        stepUnit: StepUnit;

        constructor(state: State.BasePlayable, stepUnit: StepUnit) {
            this.state = state;
            this.stepUnit = stepUnit;
        }

        get(): Promise<any> {
            return null;
        }

        async handleBackward(animation: Promise<any>): Promise<any> {
            let finalPosition = this.stepUnit.order.position;
            if (!this.state.spritesManager.getReal(this.stepUnit.pawn).getPosition().equals(finalPosition)) {
                await this.state.spritesManager.getReal(this.stepUnit.pawn).moveTo(finalPosition.x, finalPosition.y, null, false);
            }
            return animation;
        }
    }
}
