module TacticArena.Order {
    export class Fire extends BaseOrder {

        constructor(position, targets = []) {
            super('cast', position, targets);
        }

        process(ordermanager: OrderManager, steps: Step[], stepIndex: number, aIndex: number, bIndex: number): BaseOrder {
            let result = this;
            let stepUnits = steps[stepIndex].stepUnits;
            let stepUnitA = stepUnits[aIndex];
            let stepUnitB = stepUnits[bIndex];
            let positionBBeforeOrder = steps[stepIndex - 1].stepUnits[bIndex].getPosition();
            stepUnitA.apImpact[stepUnitA.pawn._id] = -2;
            let path = ordermanager.state.stageManager.getLinearPath(stepUnitA.order.position, 4);
            stepUnitA.order.targets = stepUnitA.order.targets || [];
            for (var k = 0; k < path.length; k++) {
                let targetPosition = stepUnitB.data.moveHasBeenBlocked ? positionBBeforeOrder : stepUnitB.order.position;
                if (path[k].x == targetPosition.x && path[k].y == targetPosition.y) {
                    stepUnitA.order.targets.push(stepUnitB.pawn._id);
                    stepUnitA.hpImpact[stepUnitB.pawn._id] = -2;
                }
            }
            return result;
        }

        resolve(pawn: Champion.BaseChampion, stepUnitData: StepUnitData, previousStep: StepUnit, animate: boolean, backward: boolean, i: number, state): Promise<any> {
            return new Animation.CastFire(state, pawn, this).get();
        }

    }
}
