/// <reference path="ReflexOrder.ts"/>
 module TacticArena.Order {
    export class Stand extends ReflexOrder {

        constructor(position, direction) {
            super('stand', position, direction);
        }

    }
}
