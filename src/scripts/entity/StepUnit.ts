module TacticArena.Entity {
    export class StepUnit {
        pawn:Pawn;
        stepUnitState:StepUnitState;
        order:BaseOrder;
        data:Object;

        constructor(pawn:Pawn, stepUnitState:StepUnitState, order:BaseOrder) {
            this.pawn = pawn;
            this.stepUnitState = stepUnitState;
            this.order = order;
            this.data = {};
        }
    }
}
