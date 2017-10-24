module TacticArena.Animation {
    export class Move extends BaseAnimation {
        animate:boolean;
        direction:string;

        constructor(state:State.BasePlayable, pawn:Entity.Pawn, order:BaseOrder, position:Position, animate:boolean, direction:string = null) {
            super(state, pawn, order, position);
            this.animate = animate;
            this.direction = direction;
        }

        get():Promise<any> {
            return this.state.spritesManager.getReal(self.pawn).moveTo(this.position.x, this.position.y, null, this.animate).then((res) => {
                if(this.direction) {
                    return new Animation.Stand(this.pawn, this.order, this.position).get();
                } else {
                    return res;
                }
            });
        }
    }
}
