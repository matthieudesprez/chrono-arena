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

        createPromiseMove(entity, x, y, animate, direction = null) {
            return entity.moveTo(x, y, null, animate).then((res) => {
                if(direction) {
                    this.createPromiseStand(entity, direction).then((res) => {
                        return true;
                    });
                } else {
                    return res;
                }
            });
        }

        createPromiseBlock(entity, initialPosition, targetPosition, animate) {
            if (animate) {
                return entity.moveTo(targetPosition.x, targetPosition.y).then((res) => {
                    entity.blocked();
                    entity.moveTo(initialPosition.x, initialPosition.y).then((res) => {
                        return res;
                    });
                });
            } else {
                return this.createPromiseStand(entity, entity.getDirection());
            }
        }

        createPromiseAttack(entity, target) {
            return entity.attack(target).then((res) => {
                return res;
            });
        }

        createPromiseStand(entity, direction) {
            return new Promise((resolve, reject) => {
                entity.faceDirection(direction);
                setTimeout(function () {
                    resolve(true);
                }, 250);
            });
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
            if(position.x != order.x || position.y != order.y) {
                resultPromise = entity.moveTo(order.x, order.y, null, false).then((res) => {
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
                    var s = step[i].stepUnitState;
                    var p = null;
                    let position = e.getPosition();

                    e.setAp(s.ap);
                    if (o.action == 'move') {
                        if (s.moveHasBeenBlocked) {
                            p = this.createPromiseBlock(e, {x: o.x, y: o.y}, s.positionBlocked, animate);
                        } else {
                            if (backward && position.x == o.x && position.y == o.y) {
                                let direction = previousStep ? previousStep[i].order.direction : e.getDirection();
                                p = this.createPromiseStand(e, direction);
                            } else {
                                p = this.createPromiseMove(e, o.x, o.y, animate, o.direction);
                            }
                        }
                    } else if (o.action == 'attack') {
                        o.target.entity = this.game.orderManager.getPawn(o.target.entityId);
                        p = this.handleBackwardPromise(this.createPromiseAttack(e, o.target), e, o, position, animate);
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
                        p = this.handleBackwardPromise(this.createPromiseStand(e, o.direction), e, o, position, animate);
                    }
                    promisesOrders.push(p);
                }

                this.manageProjectionDislay(step);

                Promise.all(promisesOrders).then((res) => {
                    if(!backward) {
                        this.manageProjectionDislay(step);
                    }
                    step.forEach( s => {
                        let forceAnimation = typeof s.stepUnitState.dies !== 'undefined' && s.stepUnitState.dies;
                        s.entity.setHp(s.stepUnitState.hp, forceAnimation);
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
                        condition = (order.x == position.x && order.y == position.y);
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
