module TacticArena {
    export class BaseAnimation {
        state:State.BasePlayable;
        pawn:Entity.Pawn;
        order:BaseOrder;
        position:Position;

        constructor(state:State.BasePlayable, pawn:Entity.Pawn, order:BaseOrder, position:Position) {
            this.state = state;
            this.pawn = pawn;
            this.order = order;
            this.position = position;
        }

        get():Promise<any> {
            return null;
        }

        handleBackward(animation:Promise<any>):Promise<any> {
            let result;
            if(this.position.x != this.order.position.x || this.position.y != this.order.position.y) {
                result = this.pawn.moveTo(this.order.position.x, this.order.position.y, null, false);
                result.then((res) => {
                    return animation;
                });
            } else {
                result = animation;
            }
            return result;
        }
    }
}
