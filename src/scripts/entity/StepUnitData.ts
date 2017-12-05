module TacticArena {
    export class StepUnitData {
        moveHasBeenBlocked:boolean;
        positionBlocked:Position;
        moved:Position;
        ap:number;
        hp:number;

        constructor(ap=null, hp=null) {
            this.moveHasBeenBlocked = false;
            this.positionBlocked = null;
            this.moved = null;
            this.ap = ap;
            this.hp = hp;
        }
    }
}
