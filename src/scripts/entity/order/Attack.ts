/// <reference path="BaseOrder.ts"/>
module TacticArena.Order {
    export class Attack extends BaseOrder {

        constructor(position, targets) {
            super('attack', position, targets);
        }

        resolve (pawn:Champion.BaseChampion, stepUnitData:StepUnitData, previousStep:StepUnit, animate:boolean, backward:boolean, i:number, state):Promise<any> {
            return new Animation.Attack(state, pawn, this).get();
        }
    }
}
