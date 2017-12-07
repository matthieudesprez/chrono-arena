module TacticArena.Animation {
    export abstract class BaseCast extends BaseAnimation {

        get(): Promise<any> {
            let animation = new Promise((resolve, reject) => {
                this.state.spritesManager.showReal(this.pawn);
                this.state.spritesManager.getReal(this.pawn).cast(this.order.position.d).then(() => {
                    return this.getCastCallback();
                }).then(() => {
                    resolve(true);
                });
            });
            //return super.handleBackward(animation);
            return animation;
        }

        getCastCallback(): Promise<any> {
            return new Promise((resolve, reject) => {
                resolve(true);
            });
        }
    }
}
