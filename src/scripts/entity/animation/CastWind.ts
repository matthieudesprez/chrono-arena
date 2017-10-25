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
                this.state.spritesManager.showReal(this.pawn);
                this.pawn.changeDirection(this.order.direction);
                this.state.spritesManager.getReal(this.pawn).castTornado(this.targets, () => {
                    self.state.spritesManager.getReal(self.pawn).stand();
                    resolve(true);
                });
            });
            return super.handleBackward(animation);
        }
    }
}
