module TacticArena {
    export class BaseOrder {
        action:string;
        position:Position;
        direction;
        targets;

        constructor(action, position, direction) {
            this.action = action;
            this.position = position;
            this.direction = direction;
            this.targets = [];
        }

        process(ordermanager:OrderManager, steps:Entity.Step[], stepIndex:number, aIndex:number, bIndex:number):BaseOrder {
            return this;
        }

    }
}
