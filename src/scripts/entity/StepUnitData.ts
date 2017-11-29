module TacticArena.Entity {
    export class StepUnitData {
        moveHasBeenBlocked:boolean;
        positionBlocked:Position;
        moved:Position;
        altered:boolean;
        ap:number;
        hp:number;
        dies:boolean;
        aWasFacingB:boolean;
        aWasNextToB:boolean;
        fleeRate:number;
        entityAApCost:number;
        entityBHpLost:number;
        aIsActive:boolean;
        aIsAlive:boolean;
        keepDirection:boolean;
        keepPosition:boolean;
        equalPositions:boolean;
        differentTeams:boolean;
        alteredEntityB:boolean;
        positionBBeforeOrder:Position;

        constructor(ap=null, hp=null) {
            this.moveHasBeenBlocked = false;
            this.positionBlocked = null;
            this.moved = null;
            this.altered = false;
            this.ap = ap;
            this.hp = hp;
            this.dies = false;

            this.aWasFacingB = false;
            this.aWasNextToB = false;

            this.fleeRate = 50;
            this.entityAApCost = 1;
            this.entityBHpLost = 0;

            this.aIsActive = false;
            this.aIsAlive = true;
            this.keepDirection = false;
            this.keepPosition = false;
            this.equalPositions = false;
            this.differentTeams = false;
            this.alteredEntityB = false;
            this.positionBBeforeOrder = null;
        }
    }
}
