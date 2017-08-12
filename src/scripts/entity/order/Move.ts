/// <reference path="ReflexOrder.ts"/>
module TacticArena.Order {
    import StepUnitData = TacticArena.Entity.StepUnitData;
    export class Move extends ReflexOrder {
        target;

        constructor(position, direction, target?) {
            super('move', position, direction);
            this.target = target;
        }

        resolve (pawn:Entity.Pawn, stepUnitData:Entity.StepUnitData, previousStep:Entity.StepUnit, animate:boolean, backward:boolean, i:number):Promise {
            let result = null;
            if (stepUnitData.moveHasBeenBlocked) {
                result = new Animation.Block(pawn, this.position, stepUnitData.positionBlocked, animate).get();
            } else {
                if (backward && pawn.getPosition().equals(this.position)) {
                    let direction = previousStep ? previousStep[i].order.direction : pawn.getDirection();
                    result = new Animation.Stand(pawn, direction).get();
                } else {
                    result = new Animation.Move(pawn, this.position, animate, this.direction).get();
                }
            }
            return result;
        }
    }
}
