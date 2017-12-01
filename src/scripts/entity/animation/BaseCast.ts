module TacticArena.Animation {
    export abstract class BaseCast extends BaseAnimation {

        get(): Promise<any> {
            let animation = new Promise((resolve, reject) => {
                this.state.spritesManager.showReal(this.pawn);
                this.state.spritesManager.getReal(this.pawn).cast(this.order.direction).then(() => {
                    return this.getCastCallback();
                }).then(() => {
                    resolve(true);
                });
            });
            return super.handleBackward(animation);
        }

        getCastCallback(): Promise<any> {
            return new Promise((resolve, reject) => {
                resolve(true);
            });
        }
    }
}
