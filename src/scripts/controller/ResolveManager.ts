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

        createPromiseBlock(entity, x, y, animate) {
            let initialPosition = entity.getPosition();
            if (animate) {
                return entity.moveTo(x, y).then((res) => {
                    entity.blocked();
                    entity.moveTo(initialPosition.x, initialPosition.y).then((res) => {
                        return res;
                    });
                });
            } else {
                return this.createPromiseStand(entity, entity.getDirection());
            }
        }

        createPromiseStand(entity, direction) {
            console.log(direction);
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

                    if (s.isHurt && !s.isAttacking) {
                        o.action = o.action.replace('move', 'stand_' + e.getDirection());
                        s.moveHasBeenBlocked = true;
                    }
                    if (s.isBlocked) {
                        p = this.createPromiseBlock(e, o.x, o.y, animate);
                    } else if (o.action == 'move') {
                        if (backward && position.x == o.x && position.y == o.y) {
                            let direction = previousStep ? previousStep[i].order.direction : e.getDirection();
                            p = this.createPromiseStand(e, direction);
                        } else {
                            p = this.createPromiseMove(e, o.x, o.y, animate);
                        }
                    } else if (o.action.indexOf('attack_') >= 0) {
                        p = e.attack(o.target);
                    } else if (o.action.indexOf('cast_') >= 0) {
                        p = e.cast(o.targets);
                    } else if (o.action.indexOf('stand_') >= 0) {
                        console.log(o.action, position.x != o.x, position.y != o.y);
                        if(position.x != o.x || position.y != o.y) {
                            p = this.createPromiseMove(e, o.x, o.y, animate, o.direction);
                        } else {
                            p = this.createPromiseStand(e, o.direction);
                        }
                    }

                    console.log(o.action);
                    //if(e.moveHasBeenBlocked) {
                    //    steps = this.pacifyEntity(steps, e);
                    //}
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
                            console.info(':)');
                            resolve(res);
                        }, (res) => {
                            console.log('erreur', res);
                        }); // recursive
                    } else {
                        this.processing = false;
                        reject(false);
                    }
                });
            });
        }

        manageProjectionDislay(step, compareActualEntity = false) {
            console.log(step, compareActualEntity);
            for (var i = 0; i < step.length; i++) {
                var entityA = step[i].entity;
                let order = step[i].order;
                let position = entityA.getProjectionOrReal().getPosition();

                if (entityA.projection) {
                    let condition = false
                    if(compareActualEntity) {
                        condition = (JSON.stringify(entityA.getPosition()) == JSON.stringify(entityA.getProjectionOrReal().getPosition()));
                    } else {
                        console.log(order, position);
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
