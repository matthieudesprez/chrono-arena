module TacticArena.Animation {
    export class CastFire extends BaseAnimation {
        state;
        targets;

        constructor(pawn:Entity.Pawn, order:BaseOrder, position:Position, state) {
            super(pawn, order, position);
            // TODO voué à disparaitre
            this.state = state;
            this.targets = [];
            order.targets.forEach( t => { this.targets.push(this.state.orderManager.getPawn(t)); });
        }

        get():Promise<any> {
            let self = this;
            let animation = new Promise((resolve, reject) => {
                if(this.pawn.projection) {
                    this.pawn.projection.hide();
                    this.pawn.show();
                }
                this.pawn.faceDirection(this.order.direction);
                this.state.spritesManager.sprites[this.pawn._id].cast(this.targets, function() {
                    self.state.spritesManager.sprites[self.pawn._id].stand();
                    resolve(true);
                });
            });
            return super.handleBackward(animation);
        }
    }
}
