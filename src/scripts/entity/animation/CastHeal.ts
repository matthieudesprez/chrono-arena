module TacticArena.Animation {
    export class CastHeal extends BaseCast {

        getCastCallback(): Promise<any> {
            return new Promise((resolve, reject) => {
                this.stepUnit.order.targets.forEach(target => {
                    let pawn = (this.state as State.BaseBattle).getChampion(target.championId);
                    this.state.spritesManager.getReal(pawn).healAnimation();
                    this.state.spritesManager.getReal(pawn).healText(this.stepUnit.hpImpact[pawn._id]);
                });
                resolve(true);
            });
        }
    }
}
