module TacticArena.Animation {
    export class Block extends BaseAnimation {
        targetPosition:Position;
        animate:boolean;

        constructor(state:State.BasePlayable, pawn:Entity.Pawn, order:BaseOrder, position:Position, targetPosition:Position, animate:boolean) {
            super(state, pawn, order, position);
            this.targetPosition = targetPosition;
            this.animate = animate;
        }

        get():Promise<any> {
            if (this.animate) {
                return this.state.spritesManager.getReal(this.pawn).moveTo(this.targetPosition.x, this.targetPosition.y).then((res) => {
                    this.state.spritesManager.getReal(this.pawn).displayText('blocked');
                    this.state.spritesManager.getReal(this.pawn).moveTo(this.position.x, this.position.y).then((res) => {
                        return res;
                    });
                });
            } else {
                return new Animation.Stand(this.state, this.pawn, this.order, this.position).get();
            }
        }
    }
}
