module TacticArena.Order {
    export class BaseOrder {
        action: string;
        position: Position;
        direction;
        targets;

        constructor(action, position, direction, targets = []) {
            this.action = action;
            this.position = position;
            this.direction = direction;
            this.targets = targets;
        }

        process(ordermanager: OrderManager, steps: Step[], stepIndex: number, aIndex: number, bIndex: number): BaseOrder {
            return this;
        }

    }
}
