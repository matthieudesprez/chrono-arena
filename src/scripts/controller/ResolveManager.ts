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

        createPromiseDie(entity) {
            return new Promise((resolve, reject) => {
                entity.die();
                setTimeout(function () {
                    resolve(true);
                }, 250);
            });
        }

        init(steps) {
            this.steps = steps;
            this.manageProjectionDislay(steps[0], true);
            this.currentIndex = 0;
        }

        handleBackwardPromise(promise, entity, order, position, animate) {
            let resultPromise;
            if(position.x != order.position.x || position.y != order.position.y) {
                resultPromise = entity.moveTo(order.position.x, order.position.y, null, false).then((res) => {
                    return true;
                });
                resultPromise.then((res) => {
                    promise.then((res) => {
                        return true;
                    });
                });
            } else {
                resultPromise = promise;
            }
            return resultPromise;
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
                    var o = step[i].order;
                    var e = step[i].entity;
                    var s = step[i].data;
                    var p = null;
                    let position = e.getPosition();

                    e.setAp(s.ap);
                    if (o.action == 'move') {
                        p = o.resolve(e, s, previousStep, animate, backward, i);
                    } else if (o.action == 'attack') {
                        o.target.entity = this.game.orderManager.getPawn(o.target.entityId);
                        p = this.handleBackwardPromise(new Animation.Attack(e, o.target).get(), e, o, position, animate);
                    } else if (o.action == 'cast') {
                        let targets = [];
                        o.targets.forEach( t => {
                            targets.push(self.game.orderManager.getPawn(t));
                        });
                        p = this.handleBackwardPromise(e.cast(targets, o.direction), e, o, position, animate);
                    }  else if (o.action == 'cast_wind') {
                        let targets = [];
                        o.targets.forEach( t => {
                            targets.push({
                                entity: self.game.orderManager.getPawn(t.entity),
                                moved: t.moved
                            });
                        });
                        p = this.handleBackwardPromise(e.castTornado(targets, o.direction), e, o, position, animate);
                    } else if (o.action == 'stand') {
                        p = this.handleBackwardPromise(new Animation.Stand(e, o.direction).get(), e, o, position, animate);
                    }
                    promisesOrders.push(p);
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
