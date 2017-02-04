module TacticArena.UI {
    export class UIManager {
        game:State.Main;
        element;
        logsUI;
        directionUI;
        actionUI;
        pawnsinfosUI;
        endTurnKey;

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

        cancelAction() {
            var activePawn = this.game.turnManager.getActivePawn();
            activePawn.destroyProjection();
            activePawn.setAp(2);

            this.directionUI.changeDirection(this.directionUI.savedDirection);

            this.game.orderManager.removeEntityOrder(activePawn._id);
            // TODO Pouvoir se passer du premier ordre
            let position = activePawn.getPosition();
            this.game.orderManager.add('stand_' + activePawn.getDirection(), activePawn, position.x, position.y);
            this.game.onActionPlayed.dispatch(activePawn);
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
            if(!this.game.orderManager.hasOrder(activePawn._id)) {
                // TODO Pouvoir se passer du premier ordre / Plus difficile pour celui ci car activePawn doit etre
                // dans OrdreManager au moment de la résolution du tour
                this.game.orderManager.add('stand_' + activePawn.getDirection(), activePawn, null, null);
            }
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
