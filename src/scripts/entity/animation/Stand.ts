module TacticArena.Animation {
    export class Stand extends BaseAnimation {

        constructor(state:State.BasePlayable, pawn:Entity.Pawn, order:BaseOrder) {
            super(state, pawn, order);
        }

        get():Promise<any> {
            let animation = new Promise((resolve, reject) => {
                this.state.spritesManager.getProjectionOrReal(this.pawn).stand(this.order.direction);
                setTimeout(function () {
                    resolve(true);
                }, 250);
            });
            return super.handleBackward(animation);
        }
    }
}
