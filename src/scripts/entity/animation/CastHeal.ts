module TacticArena.Animation {
    export class CastHeal extends BaseAnimation {
        targets;

        constructor(state:State.BasePlayable, pawn:Entity.Pawn, order:BaseOrder) {
            super(state, pawn, order);
            this.targets = [];
            order.targets.forEach( t => { this.targets.push((this.state as State.BaseBattle).orderManager.getPawn(t)); });
        }

        get():Promise<any> {
            let self = this;
            let animation = new Promise((resolve, reject) => {
                this.state.spritesManager.showReal(this.pawn);
                this.state.spritesManager.getReal(this.pawn).stand(this.order.direction);
                this.state.spritesManager.getReal(this.pawn).castHeal(this.targets, () => {
                    self.state.spritesManager.getReal(self.pawn).stand();
                    resolve(true);
                });
            });
            return super.handleBackward(animation);
        }
    }
}
