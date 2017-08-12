module TacticArena.Animation {
    export class Stand extends BaseAnimation {
        direction:string;

        constructor(pawn, direction:string = null) {
            super(pawn);
            this.direction = direction;
        }

        get() {
            return new Promise((resolve, reject) => {
                this.pawn.faceDirection(this.direction);
                setTimeout(function () {
                    resolve(true);
                }, 250);
            });
        }
    }
}
