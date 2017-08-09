module TacticArena.Order {
    export class ReflexOrder extends BaseOrder {

        constructor(action, position, direction) {
            super(action, position, direction);
        }

        // Possible cases :
        // [  ][A v][  ]
        // [A>][ B ][<A]
        // [  ][ A^][  ]
        // IF A was next to B
        // AND IF A was facing B
        // AND IF A is active (ap > 0)
        // AND IF A & B are not in the same team
        // AND IF A keeps its direction (aIsFacingB) (et ne va donc pas pas se détourner de B)
        // AND IF A stays next to B OR IF A moves toward B (equalPositions) (en lui faisant face)
        process(step, stepB, ordermanager) {
            let result = null;
            if (step.data.aWasNextToB && step.data.aWasFacingB && step.data.aIsActive && step.data.differentTeams &&
                step.data.keepDirection && (step.data.keepPosition || step.data.equalPositions)) {
                let entityBIsDodging = true;
                if (OrderManager.resolutionEsquive(step.data.fleeRate)) {
                    step.data.entityBHpLost += 1;
                    entityBIsDodging = false;
                    if (step.data.alteredEntityB) {
                        stepB.stepUnitState.moveHasBeenBlocked = (stepB.order.action == 'move');
                    }
                }
                result = new Attack(this.position, this.direction, {
                    entityId: stepB._id,
                    dodge: entityBIsDodging,
                    damages: step.data.entityBHpLost
                });
            }
            if(result === null) {
                result = this;
            }
            return result;
        }

    }
}
