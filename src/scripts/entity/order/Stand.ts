module TacticArena.Order {
    export class Stand extends BaseOrder {
        targets;

        constructor(position, targets?) {
            super('stand', position);
            this.targets = targets;
        }

        process(ordermanager: OrderManager, steps: Step[], stepIndex: number, aIndex: number, bIndex: number): BaseOrder {
            let stepUnits = steps[stepIndex].stepUnits;
            let stepUnitA = stepUnits[aIndex];
            stepUnitA.apImpact[stepUnitA.pawn._id] = -1;
            return this;
        }

        resolve(pawn: Champion.BaseChampion, stepUnitData: StepUnitData, previousStep: StepUnit, animate: boolean, backward: boolean, i: number, state): Promise<any> {
            return new Animation.Stand(state, pawn, this).get();
        }

    }
}
