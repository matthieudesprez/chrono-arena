module TacticArena.Animation {
    export class CastHeal extends BaseCast {

        getCastCallback(): Promise<any> {
            let self = this;
            return new Promise((resolve, reject) => {
                self.order.targets.forEach(target => {
                    let pawn = (self.state as State.BaseBattle).orderManager.getPawn(target);
                    self.state.spritesManager.getReal(pawn).healAnimation();
                    self.state.spritesManager.getReal(pawn).healText(1);
                });
                resolve(true);
            });
        }
    }
}
