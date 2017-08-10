module TacticArena.Order {
    export class Attack extends BaseOrder {
        target;

        constructor(position, direction, target) {
            super('attack', position, direction);
            this.target = target;
        }
    }
}
