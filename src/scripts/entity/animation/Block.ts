module TacticArena.Animation {
    export class Block extends BaseAnimation {
        initialPosition:Position;
        targetPosition:Position;
        animate:boolean;

        constructor(pawn, initialPosition:Position, targetPosition:Position, animate:boolean) {
            super(pawn);
            this.initialPosition = initialPosition;
            this.targetPosition = targetPosition;
            this.animate = animate;
        }

        get() {
            if (this.animate) {
                return this.pawn.moveTo(this.targetPosition.x, this.targetPosition.y).then((res) => {
                    this.pawn.blocked();
                    this.pawn.moveTo(this.initialPosition.x, this.initialPosition.y).then((res) => {
                        return res;
                    });
                });
            } else {
                return new Animation.Stand(this.pawn, this.pawn.getDirection()).get();
            }
        }
    }
}
