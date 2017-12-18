module TacticArena {
    export class ResolveManager {
        steps;
        game;
        processing: boolean;
        currentIndex: number;
        turnIndex: number;
        active: boolean;
        promisesOrders: Promise<any>[];

        constructor(game) {
            this.steps = [];
            this.game = game;
            this.currentIndex = 0;
            ;
            this.turnIndex = 0;
            this.processing = false;
            this.active = false;
            this.promisesOrders = [];
        }

        init(steps: Step[], turnIndex) {
            this.steps = steps;
            this.game.spritesManager.destroyAllProjections();
            this.currentIndex = 0;
            this.turnIndex = turnIndex;
        }

        /*
         * Call processStep
         */
        processSteps(index, animate: boolean = true, backward: boolean = false): Promise<any> {
            this.active = true;
            this.processing = true;
            return this.processStep(index, animate, backward).then(res => {
                if (index >= this.steps.length) { // Exit after last step
                    if (this.turnIndex < this.game.logManager.logs.length - 1) {
                        return Action.PlayTurn.process(this.game, this.turnIndex + 1);
                    } else {
                        return Action.ConfirmResolve.process(this.game);
                    }
                }
                this.processing = false; // On repasse process à false pour regagner la main sur le ResolveManager
                if (!this.game.isPaused) { // Si le time n'est pas sur pause, on enchaine avec le step suivant
                    return this.processSteps(index + 1, animate, backward); // recursive
                }
                return true;
            }, (res) => {
                console.log(res, 'something failed during animation');
            });
        }

        /*
         * Return a promise which resolves when all this.steps[index] animations are done
         */
        async processStep(index: number, animate: boolean = true, backward: boolean = false): Promise<any> {
            if (index >= this.steps.length) return Promise.resolve(true);
            this.setCurrentIndex(index);
            let previousStep: Step = index > 0 ? this.steps[index - 1] : null;
            this.promisesOrders = [];
            this.steps[index].stepUnits.forEach((stepUnit, i) => {
                stepUnit.pawn.setAp(stepUnit.ap); // update pawn AP
                let previousStepUnit = (previousStep !== null) ? previousStep.stepUnits[i] : null;
                this.promisesOrders.push(stepUnit.order.resolve(stepUnit, previousStepUnit, animate, this.game)); // add animation
            });
            await Promise.all(this.promisesOrders);
            return this.updateStepUnitsChampions(index, animate, previousStep);
        }

        async updateStepUnitsChampions(index, animate, previousStep): Promise<any> {
            let diePromises = [];
            this.steps[index].stepUnits.forEach((stepUnit, i) => { // update pawn HP and its different states
                stepUnit.pawn.setPosition(stepUnit.getPosition());
                stepUnit.pawn.setHp(stepUnit.hp, true);
                if (stepUnit.pawn.getHp() <= 0) {
                    let forceAnimation = previousStep !== null && !(previousStep.stepUnits[i].order instanceof Order.Dead);
                    diePromises.push(this.game.spritesManager.getReal(stepUnit.pawn).die(animate || forceAnimation));
                }
            });
            return Promise.all(diePromises);
        }

        setCurrentIndex(index) {
            this.currentIndex = index;
            this.game.signalManager.stepResolutionIndexChange.dispatch(index);
        }

        /*
         Return a promise, which resolve when the resolveManager is not processing
         */
        isReady(): Promise<any> {
            var self = this;
            return new Promise((resolve, reject) => {
                (function isReady() {
                    if (!self.processing) resolve();
                    setTimeout(isReady, 100);
                })();
            });
        }
    }
}
