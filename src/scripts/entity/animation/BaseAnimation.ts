module TacticArena.Animation {
    export abstract class BaseAnimation {
        state: State.BasePlayable; // reference to current state, BasePlayable because can be played outside a battle
        pawn: Champion.BaseChampion; // pawn doing the animation
        order: Order.BaseOrder; // origin of the action
        stepUnit: StepUnit;

        constructor(state: State.BasePlayable, pawn: Champion.BaseChampion, order: Order.BaseOrder, stepUnit: StepUnit) {
            this.state = state;
            this.pawn = pawn;
            this.order = order;
            this.stepUnit = stepUnit;
        }

        get(): Promise<any> {
            return null;
        }

        handleBackward(animation: Promise<any>): Promise<any> {
            let result;
            let finalPosition = this.stepUnit.order.position;
            if (!this.state.spritesManager.getReal(this.pawn).getPosition().equals(finalPosition)) {
                result = this.state.spritesManager.getReal(this.pawn).moveTo(finalPosition.x, finalPosition.y, null, false);
                result.then((res) => {
                    return animation;
                });
            } else {
                result = animation;
            }
            return result;
        }
    }
}
