/// <reference path="ReflexOrder.ts"/>
module TacticArena.Order {
    export class Slash extends ReflexOrder {

        constructor(position, direction) {
            super('slash', position, direction);
        }

        process(ordermanager:OrderManager, steps:Entity.Step[], stepIndex:number, aIndex:number, bIndex:number):BaseOrder {
            let stepUnits = steps[stepIndex].stepUnits;
            let stepUnitA = stepUnits[aIndex];
            let stepUnitB = stepUnits[bIndex];
            stepUnitA.data.fleeRate = 0;
            let result = super.process(ordermanager, steps, stepIndex, aIndex, bIndex);
            if (result instanceof Attack) {
                //entityBHpLost += 1;
            }
            return result
        }

        //TODO voir pour factoriser avec Attack
        resolve (pawn:Entity.Pawn, stepUnitData:Entity.StepUnitData, previousStep:Entity.StepUnit, animate:boolean, backward:boolean, i:number, state):Promise<any> {
            return new Animation.Attack(pawn, this, pawn.getPosition(), state).get();
        }
    }
}
