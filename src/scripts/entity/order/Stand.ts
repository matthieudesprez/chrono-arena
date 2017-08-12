/// <reference path="ReflexOrder.ts"/>
 module TacticArena.Order {
    export class Stand extends ReflexOrder {
        targets;

        constructor(position, direction, targets?) {
            super('stand', position, direction);
            this.targets = targets;
        }

    }
}
