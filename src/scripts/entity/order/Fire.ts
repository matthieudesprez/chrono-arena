module TacticArena.Order {
    export class Fire extends BaseOrder {

        constructor(position, direction) {
            super('cast', position, direction);
        }

        process(ordermanager:OrderManager, steps:Entity.Step[], stepIndex:number, aIndex:number, bIndex:number):BaseOrder {
            let result = this;
            let stepUnits = steps[stepIndex].stepUnits;
            let stepUnitA = stepUnits[aIndex];
            let stepUnitB = stepUnits[bIndex];
            stepUnitA.data.entityAApCost++;
            let path = ordermanager.game.stageManager.getLinearPath(stepUnitA.pawn, 4, stepUnitA.order.direction, stepUnitA.order.position);
            stepUnitA.order.targets = stepUnitA.order.targets || [];
            for (var k = 0; k < path.length; k++) {
                let targetPosition = stepUnitB.data.moveHasBeenBlocked ? stepUnitA.data.positionBBeforeOrder : stepUnitB.order.position;
                if (path[k].x == targetPosition.x && path[k].y == targetPosition.y) {
                    stepUnitA.order.targets.push(stepUnitB.pawn._id);
                    stepUnitA.data.entityBHpLost += 2;
                }
            }
            return result
        }

    }
}
