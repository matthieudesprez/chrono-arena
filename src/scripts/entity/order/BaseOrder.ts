module TacticArena.Order {
    export class BaseOrder {
        action: string;
        position: Position;
        targets;

        constructor(action, position, targets = []) {
            this.action = action;
            this.position = position.clone();
            this.targets = targets;
        }

        process(ordermanager: OrderManager, steps: Step[], stepIndex: number, aIndex: number, bIndex: number): BaseOrder {
            return this;
        }

    }
}
