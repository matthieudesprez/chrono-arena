/// <reference path="ReflexOrder.ts"/>
module TacticArena.Order {
    export class Slash extends ReflexOrder {

        constructor(position, direction) {
            super('slash', position, direction);
        }

        process(step, stepB, ordermanager) {
            step.data.fleeRate = 0;
            let result = super.process(step, stepB, ordermanager);
            if (result instanceof Attack) {
                //entityBHpLost += 1;
            }
            return result
        }

    }
}
