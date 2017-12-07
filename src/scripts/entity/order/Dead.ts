module TacticArena.Order {
    export class Dead extends BaseOrder {
        target;

        constructor(position) {
            super('dead', position);
        }

        resolve(pawn: Champion.BaseChampion, stepUnit: StepUnit, animate: boolean, state): Promise<any> {
            return new Animation.Die(state, pawn, this, stepUnit).get();
        }
    }
}
