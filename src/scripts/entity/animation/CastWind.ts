module TacticArena.Animation {
    export class CastWind extends BaseAnimation {
        targets;

        constructor(state:State.BasePlayable, pawn:Entity.Pawn, order:BaseOrder, position:Position) {
            super(state, pawn, order, position);
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
                this.pawn.changeDirection(this.order.direction);
                this.state.spritesManager.sprites[this.pawn._id].castTornado(this.targets, function() {
                    self.state.spritesManager.sprites[self.pawn._id].stand();
                    resolve(true);
                });
            });
            return super.handleBackward(animation);
        }
    }
}
