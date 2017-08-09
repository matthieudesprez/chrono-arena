module TacticArena.Order {
    export class Fire extends BaseOrder {

        constructor(position, direction) {
            super('cast', position, direction);
        }

        process(step, stepB, ordermanager) {
            let result = this;
            step.data.entityAApCost++;
            let path = ordermanager.game.stageManager.getLinearPath(step.pawn, 4, step.order.direction, step.order.position);
            step.order.targets = step.order.targets || [];
            for (var k = 0; k < path.length; k++) {
                let targetPosition = stepB.stepUnitState.moveHasBeenBlocked ? step.data.positionBBeforeOrder : stepB.order.position;
                if (path[k].x == targetPosition.x && path[k].y == targetPosition.y) {
                    step.order.targets.push(stepB.pawn._id);
                    step.data.entityBHpLost += 2;
                }
            }
            return result
        }

    }
}
