module TacticArena.Order {
    export class Slash extends BaseOrder {

        constructor(position) {
            super('slash', position);
        }

        /*
        2 cases :
        - Champion B arrives in the dmg area (1 tile in front of A) => he takes dmg
        - Champion B was/is in the dmg area and attempts to move => he takes dmg + gets blocked
         */
        process(orderManager: OrderManager, steps: Step[], stepIndex: number, aIndex: number, bIndex: number): BaseOrder {
            let stepUnits = steps[stepIndex].stepUnits;
            let stepUnitA = stepUnits[aIndex];
            let stepUnitB = stepUnits[bIndex];
            stepUnitA.apImpact[stepUnitA.pawn._id] = -1;
            let damage = 1;
            let positionBBeforeOrder = steps[stepIndex - 1].stepUnits[bIndex].getPosition();
            let AWasNextToB = stepUnitA.getPosition().getDistanceFrom(positionBBeforeOrder) == 1;
            if (stepUnitA.getPosition().faces(stepUnitB.getPosition()) || AWasNextToB) {
                stepUnitA.hpImpact[stepUnitB.pawn._id] = -1 * damage;
                if (AWasNextToB && orderManager.alteredPawns.indexOf(stepUnitA.pawn._id) < 0) {
                    orderManager.blockChampion(steps, stepIndex, bIndex, new Order.Stand(positionBBeforeOrder.turn(stepUnitB.order.position.d)));
                }
                this.targets = [{
                    championId: stepUnitB.pawn._id,
                    dodge: false,
                    damages: damage
                }];
            }
            return this;
        }

        resolve(pawn: Champion.BaseChampion, stepUnitData: StepUnitData, previousStep: StepUnit, animate: boolean, backward: boolean, i: number, state): Promise<any> {
            return new Animation.Attack(state, pawn, this).get();
        }
    }
}
