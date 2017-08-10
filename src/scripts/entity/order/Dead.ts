module TacticArena.Order {
    export class Dead extends BaseOrder {
        target;

        constructor(position, direction) {
            super('dead', position, direction);
        }
    }
}
