module TacticArena {
    export class BaseOrder {
        action;
        position:Position;
        direction;

        constructor(action, position, direction) {
            this.action = action;
            this.position = position;
            this.direction = direction;
        }

    }
}
