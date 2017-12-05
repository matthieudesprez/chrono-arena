/// <reference path="BaseAnimation.ts"/>
module TacticArena.Animation {
    export class Attack extends BaseAnimation {

        get(): Promise<any> {
            let self = this;
            let animation = new Promise((resolve, reject) => {
                this.state.spritesManager.getReal(this.pawn).stand(this.order.position.d);
                this.state.spritesManager.getReal(this.pawn).attack(this.order.position.d).then(() => {
                    this.order.targets.forEach(target => {
                        let champion = (this.state as State.BaseBattle).getChampion(target.championId);
                        if (target.dodge) {
                            self.state.spritesManager.getReal(champion).displayText('miss');
                        } else {
                            self.state.spritesManager.getProjectionOrReal(champion).hurtAnimation();
                            self.state.spritesManager.getProjectionOrReal(champion).hurtText(target.damages);
                        }
                    });
                    resolve(true);
                });
            });
            return super.handleBackward(animation);
        }
    }
}
