/// <reference path="BaseAnimation.ts"/>
module TacticArena.Animation {
    export class Attack extends BaseAnimation {

        get(): Promise<any> {
            let self = this;
            let animation = new Promise((resolve, reject) => {
                this.state.spritesManager.getReal(this.stepUnit.pawn).stand(this.stepUnit.order.position.d);
                this.state.spritesManager.getReal(this.stepUnit.pawn).attack(this.stepUnit.order.position.d).then(() => {
                    this.stepUnit.order.targets.forEach(target => {
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
