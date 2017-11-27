module TacticArena {
    export class ResolveManager {
        steps;
        game;
        processing:boolean;
        currentIndex:Number;
        active:boolean;

        constructor(game) {
            this.steps = [];
            this.game = game;
            this.currentIndex = 0;
            this.processing = false;
            this.active = false;
        }

        init(steps:Entity.Step[]) {
            this.steps = steps;
            this.manageProjectionDislay(steps[0], true);
            this.currentIndex = 0;
        }

        /*
         * Call processStep
         */
        processSteps(index, animate:boolean = true, backward:boolean = false) {
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
         * Retourne une promesse qui est résolue lorsque toutes les animations de this.steps[index] sont résolues
         */
        processStep(index:number, animate:boolean = true, backward:boolean = false):Promise<any> {
            if (index >= this.steps.length) return Promise.resolve(true);

            let self = this;
            this.setCurrentIndex(index);
            let previousStep = index > 0 ? this.steps[index - 1] : null;

            var promisesOrders = [];
            this.steps[index].stepUnits.forEach( (stepUnit, i) => {
                stepUnit.pawn.setAp(stepUnit.data.ap); // met à jour le nombre d'AP du pawn
                promisesOrders.push(stepUnit.order.resolve(stepUnit.pawn, stepUnit.data, previousStep, animate, backward, i, self.game)); // lance l'animation
            });
            this.manageProjectionDislay(this.steps[index]);
            return Promise.all(promisesOrders).then( res => {
                if (!backward) { self.manageProjectionDislay(self.steps[index]);}

                self.steps[index].stepUnits.forEach(stepUnit => { // On met à jour la vie et les états
                    let forceAnimation = typeof stepUnit.data.dies !== 'undefined' && stepUnit.data.dies;
                    stepUnit.pawn.setHp(stepUnit.data.hp, forceAnimation);
                    //TODO update position & direction du pawn, entité logique
                    stepUnit.pawn.setPosition(stepUnit.order.position);
                    stepUnit.pawn.setDirection(stepUnit.order.direction);
                });
            });
        }

        manageProjectionDislay(step, compareActualEntity = false) {
            step.stepUnits.forEach( (stepUnit, i) => {
                var entityA = stepUnit.pawn;
                let order = stepUnit.order;
                let position = this.game.spritesManager.getProjectionOrReal(entityA).getPosition();

                if (this.game.spritesManager.getProjection(entityA)) {
                    let condition = false;
                    if(compareActualEntity) {
                        condition = this.game.spritesManager.getReal(entityA).getPosition().equals(position);
                    } else {
                        condition = order.position.equals(position);
                    }

                    if (condition) {
                        this.game.spritesManager.getProjection(entityA).hide();
                        this.game.spritesManager.getReal(entityA).show();
                    } else {
                        this.game.spritesManager.getProjection(entityA).show(0.7);
                    }
                }
            });
        }

        setCurrentIndex(index) {
            this.currentIndex = index;
            this.game.signalManager.stepResolutionIndexChange.dispatch(index);
        }
    }
}
