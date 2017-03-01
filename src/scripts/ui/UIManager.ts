module TacticArena.UI {
    export class UIManager {
        game:State.Main;
        element;
        logsUI;
        directionUI;
        actionUI;
        timeUI;
        timelineUI;
        pawnsinfosUI;
        keyManager;

        constructor(game) {
            var self = this;
            this.game = game;

            this.element = $('#content');
            this.logsUI = new UI.Logs(this);
            this.directionUI = new UI.Direction(this);
            this.actionUI = new UI.Action(this);
            this.timeUI = new UI.Time(this);
            this.timelineUI = new UI.TimeLine(this);
            this.pawnsinfosUI = new UI.PawnsInfos(this);
            this.keyManager = new UI.KeyManager(this);

            this.game.pointer.dealWith(this.logsUI.element);
            this.game.pointer.dealWith(this.actionUI.element);
            this.game.pointer.dealWith(this.timeUI.element);
            this.game.pointer.dealWith(this.timelineUI.element);
            this.game.pointer.dealWith(this.directionUI.element);

            this.logsUI.element.ready(function() {
                self.logsUI.write('##################');
                self.logsUI.write('<b># Tactical <span style="color:orangered;">A</span>' +
                    '<span style="color:limegreen;">r</span>' +
                    '<span style="color:cyan;">e</span>' +
                    '<span style="color:yellow;">n</span>' +
                    '<span style="color:orangered;">a</span> #</b>');
                self.logsUI.write('##################<br/>');
            });
        }

        init() {
            var activePawn = this.game.turnManager.getActivePawn();
            this.directionUI.init(activePawn.getDirection());
            this.logsUI.write('au tour du joueur ' + activePawn._id);
            this.pawnsinfosUI.select(activePawn._id);
        }

        initTurn(pawn, first) {
            this.game.turnManager.initTurn(pawn, first).then((data) => {
                this.init();
                this.game.turnInitialized.dispatch(pawn);
            });
        }

        endTurn() {
            var activePawn = this.game.turnManager.getActivePawn();
            if (!this.game.process) {
                this.game.stageManager.clearPossibleMove();
                this.game.stageManager.clearPath();
                this.game.process = true;
                this.game.selecting = false;
                this.game.turnManager.endTurn().then((nextPawn) => {
                    if (activePawn._id == this.game.pawns[this.game.pawns.length-1]._id) { // Si le dernier pawn a joué
                        this.pawnsinfosUI.deselectAll();
                        let steps = this.game.orderManager.resolveAll();
                        console.log(steps);
                        this.timelineUI.build(<any>steps.length);
                        this.game.resolveManager.processSteps(steps);
                    } else {
                        this.initTurn(nextPawn, false);
                    }
                });
            }
        }

        endTimeLinePhase() {
            for(var i = 0; i < this.game.pawns.length; i++) {
                this.game.pawns[i].destroyProjection();
            }
            this.game.resolveManager.active = false;
            this.pawnsinfosUI.cleanOrders();
            this.timelineUI.build(0);
            this.timeUI.updatePauseFromSelected();
            this.initTurn(this.game.turnManager.pawns[0], true);
        }
    }
}
