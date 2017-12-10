module TacticArena {
    export class StepUnit {
        _id;
        pawn: Champion.BaseChampion;
        order: Order.BaseOrder;
        checked: boolean;
        apImpact: { [championId: number]: number};
        hpImpact: { [championId: number]: number};
        blockedPosition: Position;
        ap: number;
        hp: number;
        movedPosition: Position;

        constructor(pawn: Champion.BaseChampion, ap: number, hp: number, order: Order.BaseOrder) {
            this._id = null;
            this.pawn = pawn;
            this.ap = ap;
            this.hp = hp;
            this.order = order;
            this.checked = false; // Activate the interaction process with other stepUnits
            this.hpImpact = {};
            this.apImpact = {};
            this.blockedPosition = null;
            this.movedPosition = null;
        }

        getPosition(): Position {
            return this.isMoved() ? this.movedPosition : this.order.position;
        }

        getPositions(): Position[] {
            let result = [this.order.position];
            if (this.isMoved()) result.push(this.movedPosition);
            if (this.isBlocked()) result.push(this.blockedPosition);
            return result;
        }

        collidesWith(position: Position): boolean {
            return this.getPositions().some((p: Position) => {
                return p.equals(position);
            });
        }

        isBlocked(): boolean {
            return this.blockedPosition !== null;
        }

        isMoved(): boolean {
            return this.movedPosition !== null;
        }

        targets(pawn): boolean{
            return this.order.targets.some( target => {
               return target.championId === pawn._id;
            });
        }
    }
}
