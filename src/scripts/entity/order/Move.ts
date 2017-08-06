/// <reference path="ReflexOrder.ts"/>
module TacticArena.Order {
    export class Move extends ReflexOrder {

        constructor(position, direction) {
            super('move', position, direction);
        }
    }
}
