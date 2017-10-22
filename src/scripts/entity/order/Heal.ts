module TacticArena.Order {
    export class Heal extends BaseOrder {

        constructor(position, direction) {
            super('heal', position, direction); //
        }

        process(ordermanager:OrderManager, steps:Entity.Step[], stepIndex:number, aIndex:number, bIndex:number):BaseOrder {
            let result = this;
            let stepUnits = steps[stepIndex].stepUnits;
            let stepUnitA = stepUnits[aIndex];
            let stepUnitB = stepUnits[bIndex];
            stepUnitA.data.entityAApCost++;
            let path = ordermanager.game.stageManager.getLinearPath(stepUnitA.pawn, 1, stepUnitA.order.direction, stepUnitA.order.position);
            stepUnitA.order.targets = stepUnitA.order.targets || [];
            for (var k = 0; k < path.length; k++) {
                let targetPosition = stepUnitB.data.moveHasBeenBlocked ? stepUnitA.data.positionBBeforeOrder : stepUnitB.order.position;
                if (path[k].x == targetPosition.x && path[k].y == targetPosition.y) {
                    stepUnitA.order.targets.push(stepUnitB.pawn._id);
                    stepUnitA.data.entityBHpLost -= 1;
                }
            }
            return result
        }

        resolve (pawn:Entity.Pawn, stepUnitData:Entity.StepUnitData, previousStep:Entity.StepUnit, animate:boolean, backward:boolean, i:number, state):Promise<any> {
            return new Animation.CastHeal(pawn, this, pawn.getPosition(), state).get();
        }
    }
}
