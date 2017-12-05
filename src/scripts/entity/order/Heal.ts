module TacticArena.Order {
    export class Heal extends BaseOrder {

        constructor(position) {
            super('heal', position);
        }

        process(ordermanager: OrderManager, steps: Step[], stepIndex: number, aIndex: number, bIndex: number): BaseOrder {
            let result = this;
            let stepUnits: StepUnit[] = steps[stepIndex].stepUnits;
            let stepUnitA: StepUnit = stepUnits[aIndex];
            let stepUnitB: StepUnit = stepUnits[bIndex];
            let positionBBeforeOrder = steps[stepIndex - 1].stepUnits[bIndex].getPosition();
            stepUnitA.apImpact[stepUnitA.pawn._id] = -1;
            let path = ordermanager.state.stageManager.getLinearPath(stepUnitA.order.position, 1);
            stepUnitA.order.targets = stepUnitA.order.targets || [];
            for (var k = 0; k < path.length; k++) {
                let targetPosition = stepUnitB.data.moveHasBeenBlocked ? positionBBeforeOrder : stepUnitB.order.position;
                if (path[k].x == targetPosition.x && path[k].y == targetPosition.y) {
                    stepUnitA.order.targets.push(stepUnitB.pawn._id);
                    stepUnitA.hpImpact[stepUnitB.pawn._id] = 1;
                }
            }
            return result
        }

        resolve(pawn: Champion.BaseChampion, stepUnitData: StepUnitData, previousStep: StepUnit, animate: boolean, backward: boolean, i: number, state): Promise<any> {
            return new Animation.CastHeal(state, pawn, this).get();
        }
    }
}
