module TacticArena.Animation {
    export class Block extends BaseAnimation {
        targetPosition: Position;
        animate: boolean;

        constructor(state: State.BasePlayable, pawn: Champion.BaseChampion, order: Order.BaseOrder, stepUnit: StepUnit, targetPosition: Position, animate: boolean) {
            super(state, pawn, order, stepUnit);
            this.targetPosition = targetPosition;
            this.animate = animate;
        }

        async get(): Promise<any> {
            let position = this.stepUnit.order.position;
            await this.state.spritesManager.getReal(this.pawn).moveTo(this.targetPosition.x, this.targetPosition.y, [], true, true);
            this.state.spritesManager.getReal(this.pawn).displayText('blocked');
            await this.state.spritesManager.getReal(this.pawn).moveTo(position.x, position.y);
            return new Animation.Stand(this.state, this.pawn, this.order, this.stepUnit).get();
        }
    }
}
