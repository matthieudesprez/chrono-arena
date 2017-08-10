module TacticArena.Entity {
    export class StepUnit {
        _id;
        pawn:Pawn;
        data:StepUnitData;
        order:BaseOrder;

        constructor(pawn:Pawn, data:StepUnitData, order:BaseOrder) {
            this._id = null;
            this.pawn = pawn;
            this.data = data;
            this.order = order;
        }
    }
}
