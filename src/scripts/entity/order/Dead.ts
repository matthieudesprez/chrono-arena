module TacticArena.Order {
    export class Dead extends BaseOrder {
        target;

        constructor(position) {
            super('dead', position);
        }

        resolve(stepUnit: StepUnit, previousStepUnit: StepUnit, animate: boolean, state): Promise<any> {
            return new Animation.Die(state, stepUnit).get();
        }
    }
}
