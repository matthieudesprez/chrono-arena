module TacticArena.UI {
    export class UIManager {
        game:State.Main;
        element;
        //consolelogsUI;
        directionUI;
        actionUI;
        timeUI;
        timelineUI;
        pawnsinfosUI;
        keyManager;
        notificationsUI;
        transitionUI;
        turnIndicatorUI;
        process;

        constructor(game) {
            var self = this;
            this.game = game;

            this.element = $('#content');
            //this.consolelogsUI = new UI.ConsoleLogs(this);
            this.directionUI = new UI.Direction(this);
            this.actionUI = new UI.Action(this);
            this.timeUI = new UI.Time(this);
            this.timelineUI = new UI.TimeLine(this);
            this.pawnsinfosUI = new UI.PawnsInfos(this);
            this.keyManager = new UI.KeyManager(this);
            this.notificationsUI = new UI.Notifications(this);
            this.transitionUI = new UI.Transition(this);
            this.turnIndicatorUI = new UI.TurnIndicator(this);

            //this.game.pointer.dealWith(this.consolelogsUI.element);
            this.game.pointer.dealWith(this.actionUI.element);
            this.game.pointer.dealWith(this.timeUI.element);
            this.game.pointer.dealWith(this.timelineUI.element);
            this.game.pointer.dealWith(this.directionUI.element);

            this.process = false;

            //this.consolelogsUI.element.ready(function() {
            //    self.consolelogsUI.write('##################');
            //    self.consolelogsUI.write('<b># Tactical <span style="color:orangered;">A</span>' +
            //        '<span style="color:limegreen;">r</span>' +
            //        '<span style="color:cyan;">e</span>' +
            //        '<span style="color:yellow;">n</span>' +
            //        '<span style="color:orangered;">a</span> #</b>');
            //    self.consolelogsUI.write('##################<br/>');
            //});
        }

        init() {
            var activePawn = this.game.turnManager.getActivePawn();
            this.directionUI.init(activePawn.getDirection());
            //this.consolelogsUI.write('au tour du joueur ' + activePawn._id);
            this.pawnsinfosUI.select(activePawn._id);
        }

        initOrderPhase(pawn, first) {
            this.game.turnManager.init(pawn, first).then((data) => {
                if(first) {
                    this.turnIndicatorUI.write(this.game.turnManager.currentTurnIndex + 1);
                    this.transitionUI.show('Phase de commandement').then( (res) => {
                        this.actionUI.show();
                        this.directionUI.show();
                        return true;
                    });
                }
                this.init();
                this.game.turnInitialized.dispatch(pawn);
            });
        }

        endOrderPhase() {
            var activePawn = this.game.turnManager.getActivePawn();
            if (!this.game.process) {
                this.game.stageManager.clearPossibleMove();
                this.game.stageManager.clearPath();
                this.game.process = true;
                this.game.selecting = false;
                this.game.turnManager.endTurn().then((nextPawn) => {
                    if (activePawn._id == this.game.pawns[this.game.pawns.length-1]._id) { // Si le dernier pawn a joué
                        this.actionUI.clean();
                        this.directionUI.clean();
                        let steps = this.game.orderManager.getSteps();
                        this.game.resolveManager.init(steps);
                        this.transitionUI.show('Phase de Résolution').then((res) => {
                            return true;
                        }).then((res) => {
                            this.pawnsinfosUI.selectAll();
                            this.game.logManager.add(steps);
                            this.timelineUI.build(<any>steps.length).then((res) => {
                                this.game.resolveManager.processSteps(0);
                                this.game.resolveManager.activate();
                            });
                        });
                    } else {
                        this.initOrderPhase(nextPawn, false);
                    }
                });
            }
        }

        endResolvePhase() {
            var self = this;
            for(var i = 0; i < this.game.pawns.length; i++) {
                this.game.pawns[i].destroyProjection();
            }
            this.game.resolveManager.active = false;
            this.pawnsinfosUI.cleanOrders();
            setTimeout(function() {
                self.notificationsUI.clean();
            }, 500);
            this.timelineUI.clean();
            this.timeUI.updatePauseFromSelected();
            this.initOrderPhase(this.game.turnManager.pawns[0], true);
        }

        cancelAction() {
            if(!this.game.process) {
                var activePawn = this.game.turnManager.getActivePawn();
                activePawn.show();
                activePawn.destroyProjection();
                activePawn.setAp(3);
                activePawn.getProjectionOrReal().faceDirection(this.directionUI.savedDirection);
                this.directionUI.init(this.directionUI.savedDirection);
                this.game.orderManager.removeEntityOrder(activePawn);
                this.game.onActionPlayed.dispatch(activePawn);
            }
        }
    }
}
