module TacticArena.Animation {
    export class CastWind extends BaseAnimation {
        targets;

        constructor(state:State.BasePlayable, pawn:Entity.Pawn, order:BaseOrder) {
            super(state, pawn, order);
            this.targets = [];
            this.order.targets.forEach( target => {
                this.targets.push({
                    entity: (this.state as State.BaseBattle).orderManager.getPawn(target.entity),
                    moved: target.moved
                });
            });
        }

        get():Promise<any> {
            let self = this;
            let animation = new Promise((resolve, reject) => {
                this.state.spritesManager.showReal(this.pawn);
                this.state.spritesManager.getReal(this.pawn).stand(this.order.direction);
                this.state.spritesManager.getReal(this.pawn).castTornado(this.targets, () => {
                    self.state.spritesManager.getReal(self.pawn).stand();
                    resolve(true);
                });
            });
            return super.handleBackward(animation);
        }
    }
}
