module TacticArena.Animation {
    export class Die extends BaseAnimation {

        get(): Promise<any> {
            return new Promise((resolve, reject) => {
                if (this.pawn.isAlive()) {
                    this.state.spritesManager.getReal(this.pawn).die();
                }
                resolve(true);
            });
        }
    }
}
