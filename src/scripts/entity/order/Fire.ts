module TacticArena.Order {
    export class Fire extends BaseOrder {

        constructor(position, targets = []) {
            super('cast', position, targets);
        }

        process(ordermanager: OrderManager, steps: Step[], stepIndex: number, aIndex: number, bIndex: number): BaseOrder {
            let stepUnits = steps[stepIndex].stepUnits;
            let stepUnitA = stepUnits[aIndex];
            let stepUnitB = stepUnits[bIndex];
            let positionBBeforeOrder = steps[stepIndex - 1].stepUnits[bIndex].getPosition();
            stepUnitA.apImpact[stepUnitA.pawn._id] = -2;
            let path = ordermanager.state.stageManager.getLinearPath(stepUnitA.order.position, 4);
            stepUnitA.order.targets = stepUnitA.order.targets || [];
            stepUnitA.hasInteractedWith.push(stepUnitB.pawn._id);
            if (stepUnitA.order.targets.indexOf(stepUnitB.pawn._id) < 0) {
                for (var k = 0; k < path.length; k++) {
                    let targetPosition = stepUnitB.data.moveHasBeenBlocked ? positionBBeforeOrder : stepUnitB.order.position;
                    if (path[k].x == targetPosition.x && path[k].y == targetPosition.y) {
                        stepUnitA.order.targets.push(stepUnitB.pawn._id);
                        stepUnitA.hpImpact[stepUnitB.pawn._id] = -2;
                    }
                }
            }
            return this;
        }

        resolve(pawn: Champion.BaseChampion, stepUnit: StepUnit, animate: boolean, state): Promise<any> {
            return new Animation.CastFire(state, pawn, this, stepUnit).get();
        }

    }
}
