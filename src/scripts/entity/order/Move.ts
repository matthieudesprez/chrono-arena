module TacticArena.Order {
    export class Move extends BaseOrder {

        constructor(position, direction) {
            super('move', position, direction);
        }

        process(step, stepB, ordermanager) {
            let result = this;
            if (step.data.aWasNextToB &&
                step.data.aWasFacingB &&
                step.data.aIsActive &&
                step.data.differentTeams &&
                step.data.keepDirection &&
                (step.data.keepPosition || step.data.equalPositions)) {
                let entityBIsDodging = true;
                if (step.order.action == 'slash') { step.data.fleeRate = 0; }
                if (OrderManager.resolutionEsquive(step.data.fleeRate)) {
                    step.data.entityBHpLost += 1;
                    //if(orderA.action == 'slash') { entityBHpLost += 1; }
                    entityBIsDodging = false;
                    if (ordermanager.alteredPawns.indexOf(stepB._id) < 0) {
                        stepB.entityState.moveHasBeenBlocked = (stepB.order.action == 'move');
                    }
                }
                result = new Attack(this.position, this.direction, {
                    entityId: stepB._id,
                    dodge: entityBIsDodging,
                    damages: step.data.entityBHpLost
                });
            }
            return result
        }

    }
}
