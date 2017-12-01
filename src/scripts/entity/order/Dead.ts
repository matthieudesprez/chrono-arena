module TacticArena.Order {
    export class Dead extends BaseOrder {
        target;

        constructor(position, direction) {
            super('dead', position, direction);
        }

        resolve (pawn:Champion.BaseChampion, stepUnitData:StepUnitData, previousStep:StepUnit, animate:boolean, backward:boolean, i:number, state):Promise<any> {
            return new Animation.Die(state, pawn, this).get();
        }
    }
}
