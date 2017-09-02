module TacticArena.Order {
    export class Dead extends BaseOrder {
        target;

        constructor(position, direction) {
            super('dead', position, direction);
        }

        resolve (pawn:Entity.Pawn, stepUnitData:Entity.StepUnitData, previousStep:Entity.StepUnit, animate:boolean, backward:boolean, i:number, state):Promise<any> {
            return Promise.resolve(true);
        }
    }
}
