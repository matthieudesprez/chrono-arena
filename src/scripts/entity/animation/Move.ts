module TacticArena.Animation {
    export class Move extends BaseAnimation {
        animate:boolean;
        direction:string;

        constructor(pawn:Entity.Pawn, order:BaseOrder, position:Position, animate:boolean, direction:string = null) {
            super(pawn, order, position);
            this.animate = animate;
            this.direction = direction;
        }

        get():Promise<any> {
            return this.pawn.moveTo(this.position.x, this.position.y, null, this.animate).then((res) => {
                console.log(this.direction);
                if(this.direction) {
                    return new Animation.Stand(this.pawn, this.order, this.position).get();
                } else {
                    return res;
                }
            });
        }
    }
}
