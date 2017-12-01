/// <reference path="ReflexOrder.ts"/>
module TacticArena.Order {
    export class Stand extends ReflexOrder {
        targets;

        constructor(position, direction, targets?) {
            super('stand', position, direction);
            this.targets = targets;
        }

        resolve(pawn: Champion.BaseChampion, stepUnitData: StepUnitData, previousStep: StepUnit, animate: boolean, backward: boolean, i: number, state): Promise<any> {
            return new Animation.Stand(state, pawn, this).get();
        }

    }
}
