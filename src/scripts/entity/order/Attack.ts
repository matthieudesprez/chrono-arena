/// <reference path="BaseOrder.ts"/>
module TacticArena.Order {
    export class Attack extends BaseOrder {

        constructor(position, targets) {
            super('attack', position, targets);
        }

        resolve(pawn: Champion.BaseChampion, stepUnit: StepUnit, animate: boolean, state): Promise<any> {
            return new Animation.Attack(state, pawn, this, stepUnit).get();
        }
    }
}
