/// <reference path="BaseOrder.ts"/>
module TacticArena.Order {
    export class Attack extends BaseOrder {

        constructor(position, targets) {
            super('attack', position, targets);
        }

        resolve(stepUnit: StepUnit, previousStepUnit: StepUnit, animate: boolean, state): Promise<any> {
            return new Animation.Attack(state, stepUnit).get();
        }
    }
}
