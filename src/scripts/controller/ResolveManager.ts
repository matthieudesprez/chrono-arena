module TacticArena.Controller {
    export class ResolveManager {
        steps;
        game;
        processing;
        currentIndex;
        active;
        processedIndexes;

        constructor(game) {
            this.steps = [];
            this.game = game;
            this.currentIndex = 0;
            this.processing = false;
            this.active = false;
            this.processedIndexes = [];
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

        init(steps) {
            this.steps = steps;
            this.manageProjectionDislay(steps[0], true);

            this.processedIndexes = [];
            this.currentIndex = 0;
        }

        activate() {
            this.active = true;
        }

        processSteps(index, animate:boolean = true, backward:boolean = false) {
            this.processing = true;
            this.processStep(index, animate, backward).then((res) => {
                this.game.resolvePhaseFinished.dispatch();
            }, (res) => {

            });
        }

        processStep(index:number, animate:boolean = true, backward:boolean = false) {
            return new Promise((resolve, reject) => {
                if (index >= this.steps.length) {
                    resolve(true);
                    return true;
                }
                this.currentIndex = index;
                this.processedIndexes.push(index);
                this.game.uiManager.timelineUI.update(index);
                let step = this.steps[index];
                let previousStep = index > 0 ? this.steps[index - 1] : null;
                console.info('processStep', index, step);

                var promisesOrders = [];
                for (var i = 0; i < step.length; i++) {
                    var o = step[i].order;
                    var e = step[i].entity;
                    var s = step[i].entityState;
                    var p = null;
                    let position = e.getPosition();

                    e.setAp(s.ap);
                    e.setHp(s.hp);

                    if (o.action == 'move') {
                        if (s.moveHasBeenBlocked) {
                            p = this.createPromiseBlock(e, {x: o.x, y: o.y}, s.positionBlocked, animate);
                        } else {
                            if (backward && position.x == o.x && position.y == o.y) {
                                let direction = previousStep ? previousStep[i].order.direction : e.getDirection();
                                p = this.createPromiseStand(e, direction);
                            } else {
                                p = this.createPromiseMove(e, o.x, o.y, animate);
                            }
                        }
                    } else if (o.action == 'attack') {
                        let attackP = this.createPromiseAttack(e, o.target);
                        if(position.x != o.x || position.y != o.y) {
                            p = e.moveTo(o.x, o.y, null, false).then((res) => {
                                return true;
                            });
                            p.then((res) => {
                                attackP.then((res) => {
                                    return true;
                                });
                            });
                        } else {
                            p = attackP;
                        }
                    } else if (o.action == 'cast') {
                        p = e.cast(o.targets);
                    } else if (o.action == 'stand') {
                        if(position.x != o.x || position.y != o.y) {
                            p = this.createPromiseMove(e, o.x, o.y, animate, o.direction);
                        } else {
                            p = this.createPromiseStand(e, o.direction);
                        }
                    }

                    console.log(previousStep, s, o.action, position.x != o.x, position.y != o.y);
                    promisesOrders.push(p);
                }

                this.manageProjectionDislay(step);

                Promise.all(promisesOrders).then((res) => {
                    if(!backward) {
                        this.manageProjectionDislay(step);
                    }
                    this.game.stepResolutionFinished.dispatch(index);
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
                    let condition = false
                    if(compareActualEntity) {
                        condition = (JSON.stringify(entityA.getPosition()) == JSON.stringify(entityA.getProjectionOrReal().getPosition()));
                    } else {
                        condition = (order.x == position.x && order.y == position.y);
                    }

                    if (condition) {
                        entityA.projection.hide();
                    } else {
                        entityA.projection.show(0.7);
                    }
                }
            }
        }
    }
}
