module TacticArena.Order {
    export class Fire extends BaseOrder {

        constructor(position, targets = []) {
            super('cast', position, targets);
        }

        process(ordermanager: OrderManager, steps: Step[], stepIndex: number, aIndex: number, bIndex: number): void {
            let stepUnits: StepUnit[] = steps[stepIndex].stepUnits;
            let stepUnitA: StepUnit = stepUnits[aIndex];
            let stepUnitB: StepUnit = stepUnits[bIndex];
            stepUnitA.apImpact[stepUnitA.pawn._id] = -2;
            if (!stepUnitA.targets(stepUnitB.pawn)) {
                ordermanager.state.stageManager.getLinearPath(stepUnitA.order.position, 4).forEach( (path: Position) => {
                    if (path.equals(stepUnitB.order.position)) {
                        stepUnitA.order.targets.push({
                            championId: stepUnitB.pawn._id
                        });
                        stepUnitA.hpImpact[stepUnitB.pawn._id] = -2;
                    }
                });
            }
        }

        resolve(stepUnit: StepUnit, previousStepUnit: StepUnit, animate: boolean, state): Promise<any> {
            return new Animation.CastFire(state, stepUnit).get();
        }

    }
}
