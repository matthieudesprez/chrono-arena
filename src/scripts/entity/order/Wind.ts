module TacticArena.Order {
    export class Wind extends BaseOrder {

        constructor(position, direction) {
            super('cast_wind', position, direction);
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
                    let moved = new Position(stepUnitB.order.position.x, stepUnitB.order.position.y);
                    if(stepUnitB.data.moved) { moved = stepUnitB.data.moved; }
                    if(stepUnitA.order.direction == 'E') { moved.setX(moved.x + 1); }
                    else if(stepUnitA.order.direction == 'W') { moved.setX(moved.x - 1); }
                    else if(stepUnitA.order.direction == 'S') {moved.setY(moved.y + 1); }
                    else if(stepUnitA.order.direction == 'N') { moved.setY(moved.y - 1); }

                    if(!ordermanager.tileIsFree(stepUnits, moved) || ordermanager.game.stageManager.isObstacle(moved)) { moved = null; }
                    stepUnitB.data.moved = moved;
                    stepUnitA.order.targets.push({
                        entity: stepUnitB.pawn._id,
                        moved: {x: moved.x, y: moved.y, d: ordermanager.game.stageManager.getNbTilesBetween(stepUnitA.order.position, stepUnitB.order.position)}
                    });
                    stepUnitA.data.entityBHpLost += 1;
                    ordermanager.pacifyEntity(steps, stepIndex + 1, bIndex, stepUnitB.order, stepUnitB.pawn, stepUnitB.data);
                }
            }
            return result
        }

    }
}
