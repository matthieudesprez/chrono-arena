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
        process(ordermanager:OrderManager, steps:Entity.Step[], stepIndex:number, aIndex:number, bIndex:number):BaseOrder {
            let result = this;
            let stepUnits = steps[stepIndex].stepUnits;
            let stepUnitA = stepUnits[aIndex];
            let stepUnitB = stepUnits[bIndex];
            if (stepUnitA.data.aWasNextToB && stepUnitA.data.aWasFacingB && stepUnitA.data.aIsActive && stepUnitA.data.differentTeams &&
                stepUnitA.data.keepDirection && (stepUnitA.data.keepPosition || stepUnitA.data.equalPositions)) {
                let entityBIsDodging = true;
                if (OrderManager.resolutionEsquive(stepUnitA.data.fleeRate)) {
                    stepUnitA.data.entityBHpLost += 1;
                    entityBIsDodging = false;
                    if (stepUnitA.data.alteredEntityB) {
                        stepUnitB.data.moveHasBeenBlocked = (stepUnitB.order.action == 'move');
                    }
                }
                result = new Attack(this.position, this.direction, [{
                    entityId: stepUnitB._id,
                    dodge: entityBIsDodging,
                    damages: stepUnitA.data.entityBHpLost
                }]);
            }
            if(result === null) {
                result = this;
            }
            return result;
        }

    }
}
