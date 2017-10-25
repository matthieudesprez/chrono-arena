module TacticArena.Animation {
    export class Die extends BaseAnimation {

        constructor(state:State.BasePlayable, pawn:Entity.Pawn, order:BaseOrder, position:Position) {
            super(state, pawn, order, position);
        }

        get():Promise<any> {
            return new Promise((resolve, reject) => {
                if(this.pawn.isAlive()) {
                    this.state.spritesManager.getReal(this.pawn).die();
                }
                resolve(true);
            });
        }
    }
}
