module TacticArena.Animation {
    export class Die extends BaseAnimation {
        state;

        constructor(pawn:Entity.Pawn, order:BaseOrder, position:Position, state) {
            super(pawn, order, position);
            // TODO voué à disparaître
            this.state = state;
        }

        get():Promise<any> {
            return new Promise((resolve, reject) => {
                if(this.pawn.isAlive()) {
                    this.state.spritesManager.sprites[this.pawn._id].die();
                }
                resolve(true);
            });
        }
    }
}
