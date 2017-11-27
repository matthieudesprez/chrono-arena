module TacticArena.Order {
    export class Attack extends BaseOrder {

        constructor(position, direction, targets) {
            super('attack', position, direction, targets);
        }

        resolve (pawn:Entity.Pawn, stepUnitData:Entity.StepUnitData, previousStep:Entity.StepUnit, animate:boolean, backward:boolean, i:number, state):Promise<any> {
            return new Animation.Attack(state, pawn, this).get();
        }
    }
}
