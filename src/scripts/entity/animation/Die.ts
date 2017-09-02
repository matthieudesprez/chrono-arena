module TacticArena.Animation {
    export class Die extends BaseAnimation {

        constructor(pawn:Entity.Pawn, order:BaseOrder, position:Position) {
            super(pawn, order, position);
        }

        get():Promise<any> {
            //TODO
            return Promise.resolve(true);
        }
    }
}
