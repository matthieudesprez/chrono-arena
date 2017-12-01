module TacticArena {
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
        championAApCost:number;
        championBHpLost:number;
        aIsActive:boolean;
        aIsAlive:boolean;
        keepDirection:boolean;
        keepPosition:boolean;
        equalPositions:boolean;
        differentTeams:boolean;
        alteredChampionB:boolean;
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
            this.championAApCost = 1;
            this.championBHpLost = 0;

            this.aIsActive = false;
            this.aIsAlive = true;
            this.keepDirection = false;
            this.keepPosition = false;
            this.equalPositions = false;
            this.differentTeams = false;
            this.alteredChampionB = false;
            this.positionBBeforeOrder = null;
        }
    }
}
