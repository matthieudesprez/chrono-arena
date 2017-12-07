module TacticArena.Animation {
    export class Move extends BaseAnimation {
        animate: boolean;
        direction: string;

        constructor(state: State.BasePlayable, pawn: Champion.BaseChampion, order: Order.BaseOrder, stepUnit: StepUnit, animate: boolean, direction: string = null) {
            super(state, pawn, order, stepUnit);
            this.animate = animate;
            this.direction = direction;
        }

        get(): Promise<any> {
            return this.state.spritesManager.getReal(this.pawn).moveTo(this.order.position.x, this.order.position.y, null, this.animate).then((res) => {
                return new Animation.Stand(this.state, this.pawn, this.order, this.stepUnit).get();
            });
        }
    }
}
