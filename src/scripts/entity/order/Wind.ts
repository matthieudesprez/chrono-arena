module TacticArena.Order {
    export class Wind extends BaseOrder {

        constructor(position, direction) {
            super('cast_wind', position, direction);
        }

        process(ordermanager:OrderManager, steps:Step[], stepIndex:number, aIndex:number, bIndex:number):BaseOrder {
            let result = this;
            let stepUnits = steps[stepIndex].stepUnits;
            let stepUnitA = stepUnits[aIndex];
            let stepUnitB = stepUnits[bIndex];
            stepUnitA.data.championAApCost++;
            let path = ordermanager.state.stageManager.getLinearPath(stepUnitA.order.position, 4, stepUnitA.order.direction);
            stepUnitA.order.targets = stepUnitA.order.targets || [];
            for (var k = 0; k < path.length; k++) {
                let targetPosition = stepUnitB.data.moveHasBeenBlocked ? stepUnitA.data.positionBBeforeOrder : stepUnitB.order.position;
                if (path[k].x == targetPosition.x && path[k].y == targetPosition.y) {
                    let movedPosition = new Position(stepUnitB.order.position.x, stepUnitB.order.position.y);
                    if(stepUnitB.data.moved !== null) { movedPosition = stepUnitB.data.moved; }
                    if(stepUnitA.order.direction == 'E') { movedPosition.setX(movedPosition.x + 1); }
                    else if(stepUnitA.order.direction == 'W') { movedPosition.setX(movedPosition.x - 1); }
                    else if(stepUnitA.order.direction == 'S') {movedPosition.setY(movedPosition.y + 1); }
                    else if(stepUnitA.order.direction == 'N') { movedPosition.setY(movedPosition.y - 1); }

                    if(!ordermanager.tileIsFree(stepUnits, movedPosition) || ordermanager.state.stageManager.isObstacle(movedPosition)) { movedPosition = null; }
                    stepUnitB.data.moved = movedPosition;
                    stepUnitA.order.targets.push({
                        champion: stepUnitB.pawn._id,
                        moved: movedPosition != null ? {x: movedPosition.x, y: movedPosition.y, d: ordermanager.state.stageManager.getNbTilesBetween(stepUnitA.order.position, stepUnitB.order.position)} : null
                    });
                    stepUnitA.data.championBHpLost += 1;
                    ordermanager.pacifyChampion(steps, stepIndex + 1, bIndex, stepUnitB.order, stepUnitB.pawn, stepUnitB.data);
                }
            }
            return result
        }

        resolve (pawn:Champion.BaseChampion, stepUnitData:StepUnitData, previousStep:StepUnit, animate:boolean, backward:boolean, i:number, state):Promise<any> {
            return new Animation.CastWind(state, pawn, this).get();
        }

    }
}
