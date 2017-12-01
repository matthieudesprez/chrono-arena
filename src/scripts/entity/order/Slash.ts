/// <reference path="ReflexOrder.ts"/>
module TacticArena.Order {
    export class Slash extends ReflexOrder {

        constructor(position, direction) {
            super('slash', position, direction);
        }

        process(ordermanager:OrderManager, steps:Step[], stepIndex:number, aIndex:number, bIndex:number):BaseOrder {
            let stepUnits = steps[stepIndex].stepUnits;
            let stepUnitA = stepUnits[aIndex];
            let stepUnitB = stepUnits[bIndex];
            stepUnitA.data.fleeRate = 0;
            let result = super.process(ordermanager, steps, stepIndex, aIndex, bIndex);
            if (result instanceof Attack) {
                //championBHpLost += 1;
            }
            return result
        }

        //TODO voir pour factoriser avec Attack
        resolve (pawn:Champion.BaseChampion, stepUnitData:StepUnitData, previousStep:StepUnit, animate:boolean, backward:boolean, i:number, state):Promise<any> {
            return new Animation.Attack(state, pawn, this).get();
        }
    }
}
