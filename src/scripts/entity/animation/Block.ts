module TacticArena.Animation {
    export class Block extends BaseAnimation {
        targetPosition: Position;
        animate: boolean;

        constructor(state: State.BasePlayable, pawn: Champion.BaseChampion, order: Order.BaseOrder, targetPosition: Position, animate: boolean) {
            super(state, pawn, order);
            this.targetPosition = targetPosition;
            this.animate = animate;
        }

        get(): Promise<any> {
            let spritePosition = this.state.spritesManager.getReal(this.pawn).getPosition();
            if (this.animate) {
                return this.state.spritesManager.getReal(this.pawn).moveTo(this.targetPosition.x, this.targetPosition.y).then((res) => {
                    this.state.spritesManager.getReal(this.pawn).displayText('blocked');
                    this.state.spritesManager.getReal(this.pawn).moveTo(spritePosition.x, spritePosition.y).then((res) => {
                        return res;
                    });
                });
            } else {
                return new Animation.Stand(this.state, this.pawn, this.order).get();
            }
        }
    }
}
