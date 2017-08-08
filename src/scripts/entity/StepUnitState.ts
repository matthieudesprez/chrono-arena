module TacticArena.Entity {
    export class StepUnitState {
        moveHasBeenBlocked:boolean;
        positionBlocked:Position;
        moved:Position;
        ap:Number;
        hp:Number;
        dies:boolean;

        constructor(ap=null, hp=null) {
            this.moveHasBeenBlocked = false;
            this.positionBlocked = null;
            this.moved = null;
            this.ap = ap;
            this.hp = hp;
            this.dies = false;
        }
    }
}
