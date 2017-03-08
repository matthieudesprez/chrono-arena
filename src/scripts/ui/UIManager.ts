module TacticArena.UI {
    export class UIManager {
        game:State.Main;
        element;
        consolelogsUI;
        directionUI;
        actionUI;
        timeUI;
        timelineUI;
        pawnsinfosUI;
        keyManager;
        notificationsUI;
        transitionUI;

        constructor(game) {
            var self = this;
            this.game = game;

            this.element = $('#content');
            this.consolelogsUI = new UI.ConsoleLogs(this);
            this.directionUI = new UI.Direction(this);
            this.actionUI = new UI.Action(this);
            this.timeUI = new UI.Time(this);
            this.timelineUI = new UI.TimeLine(this);
            this.pawnsinfosUI = new UI.PawnsInfos(this);
            this.keyManager = new UI.KeyManager(this);
            this.notificationsUI = new UI.Notifications(this);
            this.transitionUI = new UI.Transition(this);

            this.game.pointer.dealWith(this.consolelogsUI.element);
            this.game.pointer.dealWith(this.actionUI.element);
            this.game.pointer.dealWith(this.timeUI.element);
            this.game.pointer.dealWith(this.timelineUI.element);
            this.game.pointer.dealWith(this.directionUI.element);

            this.consolelogsUI.element.ready(function() {
                self.consolelogsUI.write('##################');
                self.consolelogsUI.write('<b># Tactical <span style="color:orangered;">A</span>' +
                    '<span style="color:limegreen;">r</span>' +
                    '<span style="color:cyan;">e</span>' +
                    '<span style="color:yellow;">n</span>' +
                    '<span style="color:orangered;">a</span> #</b>');
                self.consolelogsUI.write('##################<br/>');
            });
        }

        init() {
            var activePawn = this.game.turnManager.getActivePawn();
            this.directionUI.init(activePawn.getDirection());
            this.consolelogsUI.write('au tour du joueur ' + activePawn._id);
            this.pawnsinfosUI.select(activePawn._id);
        }

        initOrderPhase(pawn, first) {
            this.game.turnManager.init(pawn, first).then((data) => {
                if(first) {
                    this.transitionUI.show('Phase de commandement');
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
                        this.transitionUI.show('Resolution Phase');
                        this.pawnsinfosUI.selectAll();
                        let steps = this.game.orderManager.getSteps();
                        this.timelineUI.build(<any>steps.length);
                        this.game.logManager.add(steps);
                        this.game.resolveManager.init(steps);
                        this.game.resolveManager.processSteps(0);
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
            this.timelineUI.build(0);
            this.timeUI.updatePauseFromSelected();
            this.initOrderPhase(this.game.turnManager.pawns[0], true);
        }
    }
}
