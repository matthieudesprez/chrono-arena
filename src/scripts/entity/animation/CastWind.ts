module TacticArena.Animation {
    export class CastWind extends BaseAnimation {
        state;
        targets;

        constructor(pawn:Entity.Pawn, order:BaseOrder, position:Position, state) {
            super(pawn, order, position);
            // TODO voué à disparaitre
            this.state = state;
            this.targets = [];
            this.order.targets.forEach( t => {
                this.targets.push({
                    entity: this.state.orderManager.getPawn(t.entity),
                    moved: t.moved
                });
            });
        }

        get():Promise<any> {
            let self = this;
            let animation = new Promise((resolve, reject) => {
                if(this.pawn.projection) {
                    this.pawn.projection.hide();
                    this.pawn.show();
                }
                this.pawn.faceDirection(this.order.direction);
                this.pawn.sprite.castTornado(this.targets, function() {
                    self.pawn.sprite.stand();
                    resolve(true);
                });
            });
            return super.handleBackward(animation);
        }
    }
}
