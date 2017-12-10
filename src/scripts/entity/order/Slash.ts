module TacticArena.Order {
    export class Slash extends BaseOrder {

        constructor(position) {
            super('slash', position);
        }

        /*
        2 cases :
        - Champion B arrives in the dmg area (1 tile in front of A) => he takes dmg
        - Champion B was/is in the dmg area and attempts to move => he takes dmg + gets blocked
         */
        process(orderManager: OrderManager, steps: Step[], stepIndex: number, aIndex: number, bIndex: number): void {
            let stepUnits: StepUnit[] = steps[stepIndex].stepUnits;
            let stepUnitA: StepUnit = stepUnits[aIndex];
            let stepUnitB: StepUnit = stepUnits[bIndex];
            stepUnitA.apImpact[stepUnitA.pawn._id] = -1;
            if (stepUnitA.getPosition().faces(stepUnitB.getPosition())) {
                stepUnitA.hpImpact[stepUnitB.pawn._id] = -1;
                this.targets = [{
                    championId: stepUnitB.pawn._id,
                    dodge: false,
                    damages: 1
                }];
            }
        }

        resolve(pawn: Champion.BaseChampion, stepUnit: StepUnit, animate: boolean, state): Promise<any> {
            return new Animation.Attack(state, pawn, this, stepUnit).get();
        }
    }
}
