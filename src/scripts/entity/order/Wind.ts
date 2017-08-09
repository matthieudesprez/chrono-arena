module TacticArena.Order {
    export class Wind extends BaseOrder {

        constructor(position, direction) {
            super('cast_wind', position, direction);
        }

        process(stepUnit:Entity.StepUnit, stepUnitB:Entity.StepUnit, ordermanager, steps?) {
            let result = this;
            stepUnit.data.entityAApCost++;
            let path = ordermanager.game.stageManager.getLinearPath(stepUnit.pawn, 4, stepUnit.order.direction, stepUnit.order.position);
            stepUnit.order.targets = stepUnit.order.targets || [];
            for (var k = 0; k < path.length; k++) {
                let targetPosition = stepUnitB.stepUnitState.moveHasBeenBlocked ? stepUnit.data.positionBBeforeOrder : stepUnitB.order.position;
                if (path[k].x == targetPosition.x && path[k].y == targetPosition.y) {
                    let moved = new Position(stepUnitB.order.position.x, stepUnitB.order.position.y);
                    if(stepUnitB.stepUnitState.moved) { moved = stepUnitB.stepUnitState.moved; }
                    if(stepUnit.order.direction == 'E') { moved.setX(moved.x + 1); }
                    else if(stepUnit.order.direction == 'W') { moved.setX(moved.x - 1); }
                    else if(stepUnit.order.direction == 'S') {moved.setY(moved.y + 1); }
                    else if(stepUnit.order.direction == 'N') { moved.setY(moved.y - 1); }

                    if(!ordermanager.tileIsFree(stepUnit, moved) || ordermanager.game.stageManager.isObstacle(moved)) { moved = null; }
                    stepUnitB.stepUnitState.moved = moved;
                    stepUnit.order.targets.push({
                        entity: stepUnitB.pawn._id,
                        moved: {x: moved.x, y: moved.y, d: ordermanager.game.stageManager.getNbTilesBetween(stepUnit.order.position, stepUnitB.order.position)}
                    });
                    stepUnit.data.entityBHpLost += 1;
                    ordermanager.pacifyEntity(steps, stepUnit.data.l + 1, stepUnit.data.j, stepUnitB.order, stepUnitB.pawn, stepUnitB.stepUnitState);
                }
            }
            return result
        }

    }
}
