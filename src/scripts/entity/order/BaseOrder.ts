module TacticArena.Order {
    export class BaseOrder {
        action: string;
        position: Position;
        targets;
        priority;

        constructor(action, position, targets = []) {
            this.action = action;
            this.position = position.clone();
            this.targets = targets;
            this.priority = 0;
        }

        process(ordermanager: OrderManager, steps: Step[], stepIndex: number, aIndex: number, bIndex: number): void {

        }

        getPriority() {
            return this.priority;
        }

    }
}
