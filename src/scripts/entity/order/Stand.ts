module TacticArena.Order {
    export class Stand extends BaseOrder {

        constructor(position) {
            super('stand', position);
            this.priority = 1;
        }

        process(ordermanager: OrderManager, steps: Step[], stepIndex: number, aIndex: number, bIndex: number): void {
            let stepUnits = steps[stepIndex].stepUnits;
            let stepUnitA = stepUnits[aIndex];
            stepUnitA.apImpact[stepUnitA.pawn._id] = -1;
        }

        resolve(stepUnit: StepUnit, previousStepUnit: StepUnit, animate: boolean, state): Promise<any> {
            return new Animation.Stand(state, stepUnit).get();
        }

    }
}
