module TacticArena.Order {
    export class Move extends BaseOrder {

        constructor(position) {
            super('move', position);
            this.priority = 1;
        }

        process(orderManager: OrderManager, steps: Step[], stepIndex: number, aIndex: number, bIndex: number): void {
            let stepUnits: StepUnit[] = steps[stepIndex].stepUnits;
            let stepUnitA: StepUnit = stepUnits[aIndex];
            let stepUnitB: StepUnit = stepUnits[bIndex];
            stepUnitA.apImpact[stepUnitA.pawn._id] = -1;
            // IF A is not blocked yet AND A wants to go on a tile occupied by B (B.order.position OR B.blockedPosition)
            if (!stepUnitA.isBlocked() && stepUnitA.order.position.equalsOne([stepUnitB.order.position, stepUnitB.blockedPosition])) {
                orderManager.blockChampion(steps, stepIndex, aIndex, new Order.Stand(steps[stepIndex - 1].stepUnits[aIndex].getPosition().turn(stepUnitA.order.position.d)));
            }
        }

        resolve(stepUnit: StepUnit, previousStepUnit: StepUnit, animate: boolean, state): Promise<any> {
            let result = null;
            if (stepUnit.isBlocked()) {
                result = new Animation.Block(state, stepUnit, stepUnit.blockedPosition, animate).get();
            } else {
                result = new Animation.Move(state, stepUnit, previousStepUnit, animate).get();
            }
            return result;
        }
    }
}
