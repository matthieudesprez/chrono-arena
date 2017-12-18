module TacticArena.Order {
    export class Heal extends BaseOrder {

        constructor(position) {
            super('heal', position);
        }

        process(ordermanager: OrderManager, steps: Step[], stepIndex: number, aIndex: number, bIndex: number): void {
            let stepUnits: StepUnit[] = steps[stepIndex].stepUnits;
            let stepUnitA: StepUnit = stepUnits[aIndex];
            let stepUnitB: StepUnit = stepUnits[bIndex];
            stepUnitA.apImpact[stepUnitA.pawn._id] = -1;
            if (!stepUnitA.targets(stepUnitB.pawn)) {
                ordermanager.state.stageManager.getLinearPath(stepUnitA.order.position, 1).forEach( (path: Position) => {
                    if (path.equals(stepUnitB.order.position)) {
                        stepUnitA.order.targets.push({
                            championId: stepUnitB.pawn._id
                        });
                        stepUnitA.hpImpact[stepUnitB.pawn._id] = (stepUnitB.order instanceof Order.Dead) ? 0 : 1;
                    }
                });
            }
        }

        resolve(stepUnit: StepUnit, previousStepUnit: StepUnit, animate: boolean, state): Promise<any> {
            return new Animation.CastHeal(state, stepUnit).get();
        }
    }
}
