module TacticArena.Controller {
    export class ResolveManager {
        steps;
        game;
        processing;
        currentIndex;
        canResolve;
        active;
        processedIndexes;

        constructor(game) {
            this.steps = [];
            this.game = game;
            this.currentIndex = 0;
            this.processing = false;
            this.canResolve = false;
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

        isGameReadyPromise() {
            var self = this;
            return new Promise((resolve, reject) => {
                (function isGameReady(){
                    console.log('is paused');
                    if (!self.game.isPaused || self.canResolve) return resolve();
                    setTimeout(isGameReady, 300);
                })();
            });
        }

        isNextStepReadyPromise(index) {
            var self = this;
            return new Promise((resolve, reject) => {
                (function isNextStepReady(){
                    console.log('is not ready');
                    if (!self.game.isPaused || self.canResolve) return resolve();
                    setTimeout(isNextStepReady, 300);
                })();
            });
        }

        stopProcessingPromise() {
            var self = this;
            return new Promise((resolve, reject) => {
                (function stopProcessing(){
                    console.log('is processing');
                    if (!self.processing) return resolve();
                    setTimeout(stopProcessing, 300);
                })();
            });
        }

        processSteps(steps) {
            console.log(steps);
            return new Promise((resolve) => {
                this.steps = steps;
                this.active = true;
                this.canResolve = false;
                this.processedIndexes = [];
                this.currentIndex = 0;
                this.processStep(0).then((res) => {
                    this.isGameReadyPromise().then((res) => {
                        resolve(true);
                    });
                });
            });
        }

        processStep(index: number, animate: boolean = true) {
            return new Promise((resolve, reject) => {
                console.info(animate);
                this.currentIndex = index;
                this.processedIndexes.push(index);
                this.game.uiManager.timelineUI.update(index);
                let step = this.steps[index];
                this.processing = true;
                console.info('processStep', index);

                var promisesOrders = [];
                var logInfos = [];
                for (var i = 0; i < step.length; i++) {
                    var logColor = '#78dd77';
                    var o = step[i].order;
                    var e = step[i].entity;
                    var p = null;

                    if(e.isHurt && !e.isAttacking) {
                        logColor = '#f45d62';
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
                    logInfos.push('<span style="color:' + logColor + ';">entity ' + e._id + ' : ' + o.action + ' ' + o.x + ',' + o.y + '</span>');
                }
                //this.game.uiManager.logsUI.write(logInfos.join(' | '));

                Promise.all(promisesOrders).then((res) => {
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

                    console.log(this.steps.length > (index + 1), !this.game.isPaused, this.canResolve);

                    if(this.steps.length > (index + 1)) {
                        this.isNextStepReadyPromise(index).then((res) => {
                            this.processStep(index + 1).then((res) => {
                                resolve(res);
                            }); // recursive
                        });
                    } else {
                        resolve(true);
                    }
                });
            });
        }
    }
}
