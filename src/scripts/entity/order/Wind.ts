module TacticArena.Order {
    export class Wind extends BaseOrder {

        constructor(position, direction) {
            super('cast_wind', position, direction);
        }

        process(step, stepB, ordermanager, steps?) {
            let result = this;
            step.data.entityAApCost++;
            let path = ordermanager.game.stageManager.getLinearPath(step.entity, 4, step.order.direction, step.order.position);
            step.order.targets = step.order.targets || [];
            for (var k = 0; k < path.length; k++) {
                let targetPosition = stepB.entityState.moveHasBeenBlocked ? step.data.positionBBeforeOrder : stepB.order.position;
                if (path[k].x == targetPosition.x && path[k].y == targetPosition.y) {
                    let moved = new Position(stepB.order.position.x, stepB.order.position.y);
                    if(stepB.entityState.moved) { moved = stepB.entityState.moved; }
                    if(step.order.direction == 'E') { moved.setX(moved.x + 1); }
                    else if(step.order.direction == 'W') { moved.setX(moved.x - 1); }
                    else if(step.order.direction == 'S') {moved.setY(moved.y + 1); }
                    else if(step.order.direction == 'N') { moved.setY(moved.y - 1); }

                    if(!ordermanager.tileIsFree(step, moved) || ordermanager.game.stageManager.isObstacle(moved)) { moved = null; }
                    stepB.entityState.moved = moved;
                    step.order.targets.push({
                        entity: stepB.entity._id,
                        moved: {x: moved.x, y: moved.y, d: ordermanager.game.stageManager.getNbTilesBetween(step.order.position, stepB.order.position)}
                    });
                    step.data.entityBHpLost += 1;
                    ordermanager.pacifyEntity(steps, step.data.l + 1, step.data.j, stepB.order, stepB.entity, stepB.entityState);
                }
            }
            return result
        }

    }
}
