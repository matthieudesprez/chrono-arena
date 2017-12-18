module TacticArena.Animation {
    export class Stand extends BaseAnimation {

        get(): Promise<any> {
            let animation = new Promise((resolve, reject) => {
                this.state.spritesManager.getReal(this.stepUnit.pawn).stand(this.stepUnit.order.position.d);
                setTimeout(function () {
                    resolve(true);
                }, 250);
            });
            return super.handleBackward(animation);
        }
    }
}
