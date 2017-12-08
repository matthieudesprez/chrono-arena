module TacticArena.Order {
    import StepUnitData = TacticArena.StepUnitData;
    export class Move extends BaseOrder {
        target;

        constructor(position, target?) {
            super('move', position);
            this.target = target;
        }

        process(orderManager: OrderManager, steps: Step[], stepIndex: number, aIndex: number, bIndex: number): BaseOrder {
            let stepUnits = steps[stepIndex].stepUnits;
            let stepUnitA = stepUnits[aIndex];
            let stepUnitB = stepUnits[bIndex];
            stepUnitA.apImpact[stepUnitA.pawn._id] = -1;
            // If A wants to go on a tile occupied by B (can be on multiple tiles / step)
            if (stepUnitB.collidesWith(stepUnitA.order.position) && (orderManager.alteredPawns.indexOf(stepUnitA.pawn._id) < 0 || stepUnitA.data.moved)) {
                orderManager.blockChampion(steps, stepIndex, aIndex, new Order.Stand(steps[stepIndex - 1].stepUnits[aIndex].getPosition().turn(stepUnitA.order.position.d)));
                stepUnitA.hasInteractedWith.push(stepUnitB.pawn._id);
            }
            return this;
        }

        resolve(pawn: Champion.BaseChampion, stepUnit: StepUnit, animate: boolean, state): Promise<any> {
            let result = null;
            if (stepUnit.data.moveHasBeenBlocked) {
                result = new Animation.Block(state, pawn, this, stepUnit, stepUnit.data.positionBlocked, animate).get();
            } else {
                //if (backward && state.spritesManager.getReal(pawn).getPosition().equals(this.position)) {
                //    //let direction = previousStep ? previousStep[i].order.position.d : pawn.getDirection();
                //    result = new Animation.Stand(state, pawn, this).get();
                //} else {
                result = new Animation.Move(state, pawn, this, stepUnit, animate, this.position.d).get();
                //}
            }
            return result;
        }
    }
}
