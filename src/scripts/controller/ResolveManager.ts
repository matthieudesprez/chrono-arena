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

        init(steps) {
            this.steps = steps;
            this.manageProjectionDislay(steps[0], true);
            this.currentIndex = 0;
        }

        processSteps(index, animate:boolean = true, backward:boolean = false) {
            this.processing = true;
            this.active = true;
            this.processStep(index, animate, backward).then((res) => {
                this.game.signalManager.resolvePhaseFinished.dispatch();
            }, (res) => {

            });
        }

        processStep(index:number, animate:boolean = true, backward:boolean = false) {
            let self = this;
            return new Promise((resolve, reject) => {
                if (index >= this.steps.length) {
                    resolve(true);
                    return true;
                }
                this.currentIndex = index;
                this.game.signalManager.stepResolutionIndexChange.dispatch(index);
                let step = this.steps[index];
                let previousStep = index > 0 ? this.steps[index - 1] : null;

                var promisesOrders = [];
                for (var i = 0; i < step.length; i++) {
                    let pawn = step[i].entity;
                    let stepUnitData = step[i].data;
                    pawn.setAp(stepUnitData.ap);
                    promisesOrders.push(step[i].order.resolve(pawn, stepUnitData, previousStep, animate, backward, i, self.game));
                }

                this.manageProjectionDislay(step);

                Promise.all(promisesOrders).then((res) => {
                    if(!backward) {
                        this.manageProjectionDislay(step);
                    }
                    step.forEach( s => {
                        let forceAnimation = typeof s.data.dies !== 'undefined' && s.data.dies;
                        s.entity.setHp(s.data.hp, forceAnimation);
                    });
                    this.game.signalManager.stepResolutionFinished.dispatch(index);
                    if (this.steps.length > (index + 1) && !this.game.isPaused) {
                        this.processStep(index + 1).then((res) => {
                            resolve(res);
                        }, (res) => {

                        }); // recursive
                    } else {
                        this.processing = false;
                        reject(false);
                    }
                });
            });
        }

        manageProjectionDislay(step, compareActualEntity = false) {
            for (var i = 0; i < step.length; i++) {
                var entityA = step[i].entity;
                let order = step[i].order;
                let position = entityA.getProjectionOrReal().getPosition();

                if (entityA.projection) {
                    let condition = false;
                    if(compareActualEntity) {
                        condition = (JSON.stringify(entityA.getPosition()) == JSON.stringify(entityA.getProjectionOrReal().getPosition()));
                    } else {
                        condition = order.position.equals(position);
                    }

                    if (condition) {
                        entityA.projection.hide();
                        entityA.show();
                    } else {
                        entityA.projection.show(0.7);
                        //entityA.hide();
                    }
                }
            }
        }
    }
}
