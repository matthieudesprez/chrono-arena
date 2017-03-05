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
            if(animate) {
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
                setTimeout(function() {
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

        processSteps(index, animate: boolean = true) {
            this.processStep(index, animate).then((res) => {
                this.game.resolvePhaseFinished.dispatch();
            }, (res) => {

            });
        }

        processStep(index: number, animate: boolean = true) {
            return new Promise((resolve, reject) => {
                if(index >= this.steps.length) {
                    resolve(true);
                    return true;
                }
                this.currentIndex = index;
                this.processedIndexes.push(index);
                this.game.uiManager.timelineUI.update(index);
                let step = this.steps[index];
                this.processing = true;
                console.info('processStep', index);

                var promisesOrders = [];
                for (var i = 0; i < step.length; i++) {
                    var o = step[i].order;
                    var e = step[i].entity;
                    var p = null;

                    if(e.isHurt && !e.isAttacking) {
                        o.action = o.action.replace('move', 'stand_' + e.getDirection());
                        e.moveHasBeenBlocked = true;
                    }
                    if(e.isBlocked) {
                        p = this.createPromiseBlock(e, o.x, o.y, animate);
                    } else if (o.action == 'move') {
                        p = this.createPromiseMove(e, o.x, o.y, animate);
                    } else if (o.action.indexOf('attack_') >= 0) {
                        p = e.attack(o.target);
                    } else if (o.action.indexOf('cast_') >= 0) {
                        p = e.cast(o.targets);
                    } else if (o.action.indexOf('stand_') >= 0) {
                        p = this.createPromiseStand(e, o.action.replace('stand_', ''), o.x, o.y, animate);
                    }
                    //if(e.moveHasBeenBlocked) {
                    //    steps = this.pacifyEntity(steps, e);
                    //}
                    promisesOrders.push(p);
                }

                Promise.all(promisesOrders).then((res) => {
                    this.game.stepResolutionFinished.dispatch(index);
                    this.processing = false;

                    for(var i = 0; i < step.length; i++) {
                        var entityA = step[i].entity;
                        if(entityA.projection) {
                            // Si entity et sa projection se chevauchent durant la résolution
                            if(JSON.stringify(entityA.getPosition()) == JSON.stringify(entityA.getProjectionOrReal().getPosition())) {
                                entityA.projection.hide();
                                console.info('hide');
                            } else {
                                entityA.projection.show(0.7);
                                console.info('show');
                            }
                        }
                    }

                    if(this.steps.length > (index + 1)) {
                        if (!this.game.isPaused) {
                            this.processStep(index + 1).then((res) => {
                                resolve(res);
                            }, (res) => {
                                console.log('erreur', res);
                            }); // recursive
                        } else {
                            reject(false);
                        }
                    } else {
                        resolve(true);
                    }
                });
            });
        }
    }
}
