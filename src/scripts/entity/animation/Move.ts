module TacticArena.Animation {
    export class Move extends BaseAnimation {
        position:Position;
        animate:boolean;
        direction:string;

        constructor(pawn, position:Position, animate:boolean, direction:string = null) {
            super(pawn);
            this.position = position;
            this.animate = animate;
            this.direction = direction;
        }

        get() {
            return this.pawn.moveTo(this.position.x, this.position.y, null, this.animate).then((res) => {
                if(this.direction) {
                    new Animation.Stand(this.pawn, this.direction).get().then((res) => {
                        return true;
                    });
                } else {
                    return res;
                }
            });
        }
    }
}
