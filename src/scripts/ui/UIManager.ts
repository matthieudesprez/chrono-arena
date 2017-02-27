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
        enterKey;
        leftKey;
        rightKey;
        downKey;
        upKey;
        cancelKey;
        pauseKey;

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

            this.game.pointer.dealWith(this.logsUI.element);
            this.game.pointer.dealWith(this.actionUI.element);
            this.game.pointer.dealWith(this.timeUI.element);
            this.game.pointer.dealWith(this.timelineUI.element);
            this.game.pointer.dealWith(this.directionUI.element);

            this.enterKey = this.game.input.keyboard.addKey(Phaser.KeyCode.ENTER);
            this.enterKey.onDown.add(this.enterKeyPressed, this);

            this.pauseKey = this.game.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR);
            this.pauseKey.onDown.add(this.pauseResolve, this);

            this.leftKey = this.game.input.keyboard.addKey(Phaser.KeyCode.LEFT);
            this.leftKey.onDown.add(function() {self.directionUI.changeDirection('W');}, this);
            this.rightKey = this.game.input.keyboard.addKey(Phaser.KeyCode.RIGHT);
            this.rightKey.onDown.add(function() {self.directionUI.changeDirection('E');}, this);
            this.downKey = this.game.input.keyboard.addKey(Phaser.KeyCode.DOWN);
            this.downKey.onDown.add(function() {self.directionUI.changeDirection('S');}, this);
            this.upKey = this.game.input.keyboard.addKey(Phaser.KeyCode.UP);
            this.upKey.onDown.add(function() {self.directionUI.changeDirection('N');}, this);

            this.cancelKey = this.game.input.keyboard.addKey(Phaser.KeyCode.BACKSPACE);
            this.cancelKey.onDown.add(this.cancelAction, this);

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

        enterKeyPressed() {
            if(this.game.resolveManager.active) {
                this.timeUI.goForward();
            } else {
                this.endTurn();
            }
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
                        this.game.orderManager.resolveAll().then((steps) => {
                            console.log(steps);
                            this.timelineUI.build(steps.length);
                            return this.game.resolveManager.processSteps(steps);
                        }).then((res) => {
                            for(var i = 0; i < this.game.pawns.length; i++) {
                                this.game.pawns[i].destroyProjection();
                            }
                            this.game.resolveManager.active = false;
                            this.pawnsinfosUI.cleanOrders();
                            this.timelineUI.build(0);
                            this.initTurn(nextPawn, true);
                        });
                    } else {
                        this.initTurn(nextPawn, false);
                    }
                });
            }
        }

        pauseResolve() {
            this.timeUI.togglePause();
        }
    }
}
