module TacticArena {
    export class StepUnit {
        _id;
        pawn: Champion.BaseChampion;
        data: StepUnitData;
        order: Order.BaseOrder;

        constructor(pawn: Champion.BaseChampion, data: StepUnitData, order: Order.BaseOrder) {
            this._id = null;
            this.pawn = pawn;
            this.data = data;
            this.order = order;
        }
    }
}
