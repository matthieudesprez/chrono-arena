module TacticArena.Animation {
    export class Stand extends BaseAnimation {

        constructor(pawn:Entity.Pawn, order:BaseOrder, position:Position) {
            super(pawn, order, position);
        }

        get():Promise<any> {
            let animation = new Promise((resolve, reject) => {
                this.pawn.faceDirection(this.order.direction);
                setTimeout(function () {
                    resolve(true);
                }, 250);
            });
            return super.handleBackward(animation);
        }
    }
}
