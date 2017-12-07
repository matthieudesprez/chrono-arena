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
            this.manageProjectionDislay(steps[0], true);
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
                stepUnit.pawn.setAp(stepUnit.data.ap); // update pawn AP
                promisesOrders.push(stepUnit.order.resolve(stepUnit.pawn, stepUnit, animate, self.game)); // execute animation
            });
            this.manageProjectionDislay(this.steps[index]);
            return Promise.all(promisesOrders).then(res => {
                if (!backward) {
                    self.manageProjectionDislay(self.steps[index]);
                }
                self.steps[index].stepUnits.forEach((stepUnit, i) => { // update pawn HP and its different states
                    stepUnit.pawn.setPosition(stepUnit.getPosition());
                    stepUnit.pawn.setHp(stepUnit.data.hp, true);
                    if (stepUnit.pawn.getHp() <= 0) {
                        let forceAnimation = previousStep !== null && !(previousStep.stepUnits[i].order instanceof Order.Dead);
                        self.game.spritesManager.getReal(stepUnit.pawn).die(animate || forceAnimation);
                    }
                });
            });
        }

        manageProjectionDislay(step, compareActualEntity = false) {
            step.stepUnits.forEach((stepUnit, i) => {
                var championA = stepUnit.pawn;
                let order = stepUnit.order;
                let position = this.game.spritesManager.getProjectionOrReal(championA).getPosition();

                if (this.game.spritesManager.getProjection(championA)) {
                    let condition = false;
                    if (compareActualEntity) {
                        condition = this.game.spritesManager.getReal(championA).getPosition().equals(position);
                    } else {
                        condition = order.position.equals(position);
                    }

                    //if (condition || stepUnit.data.hp <= 0) { // || stepUnit.data.altered) {
                    //    this.game.spritesManager.getProjection(championA).hide();
                    //    this.game.spritesManager.getReal(championA).show();
                    //} else {
                    //    this.game.spritesManager.getProjection(championA).show(0.7);
                    //}
                }
            });
        }

        setCurrentIndex(index) {
            this.currentIndex = index;
            this.game.signalManager.stepResolutionIndexChange.dispatch(index);
        }
    }
}
