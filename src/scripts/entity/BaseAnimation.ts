module TacticArena {
    export class BaseAnimation {
        pawn:Entity.Pawn;
        order:BaseOrder;
        position:Position;

        constructor(pawn:Entity.Pawn, order:BaseOrder, position:Position) {
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
                result = this.pawn.moveTo(this.order.position.x, this.order.position.y, null, false).then((res) => {
                    return true;
                });
                result.then((res) => {
                    animation.then((res) => {
                        return true;
                    });
                });
            } else {
                result = animation;
            }
            return result;
        }
    }
}
