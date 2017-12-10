module TacticArena {
    export class ResolveManager {
        steps;
        game;
        processing: boolean;
        currentIndex: Number;
        active: boolean;

        constructor(game) {
            this.steps = [];
            this.game = game;
            this.currentIndex = 0;
            this.processing = false;
            this.active = false;
        }

        init(steps: Step[]) {
            this.steps = steps;
            this.game.spritesManager.destroyAllProjections();
            this.currentIndex = 0;
        }

        /*
         * Call processStep
         */
        processSteps(index, animate: boolean = true, backward: boolean = false) {
            this.processing = true;
            this.active = true;
            let self = this;
            this.processStep(index, animate, backward).then((res) => {
                if (index >= self.steps.length) { // Si on est après le dernier step, on sort
                    return this.game.signalManager.resolvePhaseFinished.dispatch();
                }

                this.game.signalManager.stepResolutionFinished.dispatch(index);

                if (!this.game.isPaused) { // Si le time n'est pas sur pause, on enchaine avec le step suivant
                    self.processSteps(index + 1, animate, backward); // recursive
                }
            }, (res) => {
                console.log(res, 'something failed during animation');
            });
        }

        /*
         * Return a promise which resolves when all this.steps[index] animations are done
         */
        processStep(index: number, animate: boolean = true, backward: boolean = false): Promise<any> {
            if (index >= this.steps.length) return Promise.resolve(true);

            let self = this;
            this.setCurrentIndex(index);
            let previousStep: Step = index > 0 ? this.steps[index - 1] : null;

            var promisesOrders = [];
            this.steps[index].stepUnits.forEach((stepUnit, i) => {
                stepUnit.pawn.setAp(stepUnit.ap); // update pawn AP
                promisesOrders.push(stepUnit.order.resolve(stepUnit.pawn, stepUnit, animate, self.game)); // execute animation
            });
            return Promise.all(promisesOrders).then(res => {
                self.steps[index].stepUnits.forEach((stepUnit, i) => { // update pawn HP and its different states
                    stepUnit.pawn.setPosition(stepUnit.getPosition());
                    stepUnit.pawn.setHp(stepUnit.hp, true);
                    if (stepUnit.pawn.getHp() <= 0) {
                        let forceAnimation = previousStep !== null && !(previousStep.stepUnits[i].order instanceof Order.Dead);
                        self.game.spritesManager.getReal(stepUnit.pawn).die(animate || forceAnimation);
                    }
                });
            });
        }

        setCurrentIndex(index) {
            this.currentIndex = index;
            this.game.signalManager.stepResolutionIndexChange.dispatch(index);
        }
    }
}
