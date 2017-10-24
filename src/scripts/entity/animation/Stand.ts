module TacticArena.Animation {
    export class Stand extends BaseAnimation {

        constructor(state:State.BasePlayable, pawn:Entity.Pawn, order:BaseOrder, position:Position) {
            super(state, pawn, order, position);
        }

        get():Promise<any> {
            let animation = new Promise((resolve, reject) => {
                this.pawn.changeDirection(this.order.direction);
                setTimeout(function () {
                    resolve(true);
                }, 250);
            });
            return super.handleBackward(animation);
        }
    }
}
