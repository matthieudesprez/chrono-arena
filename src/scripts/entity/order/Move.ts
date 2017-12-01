/// <reference path="ReflexOrder.ts"/>
module TacticArena.Order {
    import StepUnitData = TacticArena.StepUnitData;
    export class Move extends ReflexOrder {
        target;

        constructor(position, direction, target?) {
            super('move', position, direction);
            this.target = target;
        }

        resolve (pawn:Champion.BaseChampion, stepUnitData:StepUnitData, previousStep:StepUnit, animate:boolean, backward:boolean, i:number, state):Promise<any> {
            let result = null;
            if (stepUnitData.moveHasBeenBlocked) {
                result = new Animation.Block(state, pawn, this, stepUnitData.positionBlocked, animate).get();
            } else {
                if (backward && state.spritesManager.getReal(pawn).getPosition().equals(this.position)) {
                    //let direction = previousStep ? previousStep[i].order.direction : pawn.getDirection();
                    result = new Animation.Stand(state, pawn, this).get();
                } else {
                    result = new Animation.Move(state, pawn, this, animate, this.direction).get();
                }
            }
            return result;
        }
    }
}
