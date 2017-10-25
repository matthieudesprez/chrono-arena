module TacticArena.Animation {
    export class CastHeal extends BaseAnimation {
        targets;

        constructor(state:State.BasePlayable, pawn:Entity.Pawn, order:BaseOrder, position:Position) {
            super(state, pawn, order, position);
            this.targets = [];
            order.targets.forEach( t => { this.targets.push(this.state.orderManager.getPawn(t)); });
        }

        get():Promise<any> {
            let self = this;
            let animation = new Promise((resolve, reject) => {
                this.state.spritesManager.showReal(this.pawn);
                this.pawn.changeDirection(this.order.direction);
                this.state.spritesManager.getReal(this.pawn).castHeal(this.targets, () => {
                    self.state.spritesManager.getReal(self.pawn).stand();
                    resolve(true);
                });
            });
            return super.handleBackward(animation);
        }
    }
}
