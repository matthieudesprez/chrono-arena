module TacticArena {
    export class StepUnit {
        _id;
        pawn: Champion.BaseChampion;
        data: StepUnitData;
        order: Order.BaseOrder;
        checked: boolean;
        apImpact: { [championId: number]: number};
        hpImpact: { [championId: number]: number};
        hasInteractedWith: number[];

        constructor(pawn: Champion.BaseChampion, data: StepUnitData, order: Order.BaseOrder) {
            this._id = null;
            this.pawn = pawn;
            this.data = data;
            this.order = order;
            this.checked = true;
            this.hpImpact = {};
            this.apImpact = {};
            this.hasInteractedWith = [];
        }

        getPosition(): Position {
            return this.data.moved ? this.data.moved : this.order.position;
        }

        getPositions(): Position[] {
            let result = [this.order.position];
            if(this.data.moved) result.push(this.data.moved);
            if(this.data.positionBlocked) result.push(this.data.positionBlocked);
            return result;
        }

        collidesWith(position: Position): boolean {
            return this.getPositions().some( (p: Position) => {
                return p.equals(position);
            });
        }
    }
}
