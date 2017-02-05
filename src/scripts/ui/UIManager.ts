module TacticArena.UI {
    export class UIManager {
        game:State.Main;
        element;
        logsUI;
        directionUI;
        actionUI;
        pawnsinfosUI;
        endTurnKey;
        leftKey;
        rightKey;
        downKey;
        upKey;
        cancelKey;

        constructor(game) {
            var self = this;
            this.game = game;

            this.element = $('#content');
            this.logsUI = new UI.Logs(this);
            this.directionUI = new UI.Direction(this);
            this.actionUI = new UI.Action(this);
            this.pawnsinfosUI = new UI.PawnsInfos(this);

            this.game.pointer.dealWith(this.logsUI.element);
            this.game.pointer.dealWith(this.actionUI.element);
            this.game.pointer.dealWith(this.directionUI.element);

            this.endTurnKey = this.game.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR);
            this.endTurnKey.onDown.add(this.endTurn ,this);

            this.leftKey = this.game.input.keyboard.addKey(Phaser.KeyCode.LEFT);
            this.leftKey.onDown.add(function() {self.directionUI.changeDirection('W');} ,this);
            this.rightKey = this.game.input.keyboard.addKey(Phaser.KeyCode.RIGHT);
            this.rightKey.onDown.add(function() {self.directionUI.changeDirection('E');} ,this);
            this.downKey = this.game.input.keyboard.addKey(Phaser.KeyCode.DOWN);
            this.downKey.onDown.add(function() {self.directionUI.changeDirection('S');} ,this);
            this.upKey = this.game.input.keyboard.addKey(Phaser.KeyCode.UP);
            this.upKey.onDown.add(function() {self.directionUI.changeDirection('N');} ,this);

            this.cancelKey = this.game.input.keyboard.addKey(Phaser.KeyCode.BACKSPACE);
            this.cancelKey.onDown.add(this.cancelAction ,this);

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
            console.log(activePawn.getDirection());
            this.directionUI.init(activePawn.getDirection());
            this.logsUI.write('au tour du joueur ' + activePawn._id);
            this.pawnsinfosUI.select(activePawn._id);
        }

        cancelAction() {
            if(!this.game.process) {
                var activePawn = this.game.turnManager.getActivePawn();
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
                this.game.process = false;
                this.init();
                this.game.turnInitialized.dispatch(pawn);
            });
        }

        endTurn() {
            var activePawn = this.game.turnManager.getActivePawn();
            if (!this.game.process) {
                this.game.process = true;
                this.game.turnManager.endTurn().then((nextPawn) => {
                    if (activePawn._id == this.game.pawns[this.game.pawns.length-1]._id) { // Si le dernier pawn a joué
                        this.game.orderManager.resolveAll().then((res) => {
                            this.pawnsinfosUI.cleanOrders();
                            this.initTurn(nextPawn, true);
                        });
                    } else {
                        this.initTurn(nextPawn, false);
                    }
                });
            }
        }
    }
}
