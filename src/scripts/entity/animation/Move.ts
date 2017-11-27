module TacticArena.Animation {
    export class Move extends BaseAnimation {
        animate:boolean;
        direction:string;

        constructor(state:State.BasePlayable, pawn:Entity.Pawn, order:BaseOrder, animate:boolean, direction:string = null) {
            super(state, pawn, order);
            this.animate = animate;
            this.direction = direction;
        }

        get():Promise<any> {
            return this.state.spritesManager.getReal(this.pawn).moveTo(this.order.position.x, this.order.position.y, null, this.animate).then((res) => {
                if(this.direction) {
                    return new Animation.Stand(this.state, this.pawn, this.order).get();
                } else {
                    return res;
                }
            });
        }
    }
}
