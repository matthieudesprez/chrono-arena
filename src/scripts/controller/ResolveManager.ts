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

        createPromiseMove(entity, x, y, animate) {
            return entity.moveTo(x, y, null, animate).then((res) => {
                return res;
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
                return this.createPromiseStand(entity, entity.getDirection(), x, y, animate);
            }
        }

        createPromiseStand(entity, direction, x, y, animate) {
            return new Promise((resolve, reject) => {
                entity.faceDirection(direction, x, y, animate);
                setTimeout(function () {
                    resolve(true);
                }, 250);
            });
        }

        init(steps) {
            this.steps = steps;
            this.active = true;
            this.processedIndexes = [];
            this.currentIndex = 0;
        }

        processSteps(index, animate:boolean = true, backward:boolean = false) {
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
                this.processing = true;
                console.info('processStep', index, step);

                var promisesOrders = [];
                for (var i = 0; i < step.length; i++) {
                    var o = step[i].order;
                    var e = step[i].entity;
                    var p = null;
                    let position = e.getPosition();

                    if (e.isHurt && !e.isAttacking) {
                        o.action = o.action.replace('move', 'stand_' + e.getDirection());
                        e.moveHasBeenBlocked = true;
                    }
                    if (e.isBlocked) {
                        p = this.createPromiseBlock(e, o.x, o.y, animate);
                    } else if (o.action == 'move') {
                        if (backward && position.x == o.x && position.y == o.y) {
                            let direction = previousStep ? previousStep[i].order.direction : e.getDirection();
                            p = this.createPromiseStand(e, direction, o.x, o.y, animate);
                        } else {
                            p = this.createPromiseMove(e, o.x, o.y, animate);
                        }
                    } else if (o.action.indexOf('attack_') >= 0) {
                        p = e.attack(o.target);
                    } else if (o.action.indexOf('cast_') >= 0) {
                        p = e.cast(o.targets);
                    } else if (o.action.indexOf('stand_') >= 0) {
                        if(backward && (position.x != o.x || position.y != o.y)) {
                            p = this.createPromiseMove(e, o.x, o.y, animate);
                        } else {
                            p = this.createPromiseStand(e, o.action.replace('stand_', ''), o.x, o.y, animate);
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
                    this.game.stepResolutionFinished.dispatch(index);
                    this.processing = false;

                    if (this.steps.length > (index + 1) && !this.game.isPaused) {
                        this.processStep(index + 1).then((res) => {
                            resolve(res);
                        }, (res) => {
                            console.log('erreur', res);
                        }); // recursive
                    } else {
                        reject(false);
                    }
                });
            });
        }

        manageProjectionDislay(step) {
            for (var i = 0; i < step.length; i++) {
                var entityA = step[i].entity;
                let order = step[i].order;
                let position = entityA.getProjectionOrReal().getPosition();

                if (entityA.projection) {
                    if (order.x == position.x && order.y == position.y) {
                        entityA.projection.hide();
                        console.info('hide');
                    } else {
                        entityA.projection.show(0.7);
                        console.info('show');
                    }
                }
            }
        }
    }
}
