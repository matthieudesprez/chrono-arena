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
                self.logsUI.write('<b>Tactic Arena</b>');
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

            this.game.orderManager.removeEntityOrder(activePawn._id);
            // TODO Pouvoir se passer du premier ordre
            this.game.orderManager.add('stand_' + activePawn.getDirection(), activePawn, null, null);
            this.game.onActionPlayed.dispatch(activePawn);
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
                if (activePawn._id == this.game.pawns[this.game.pawns.length-1]._id) { // Si le dernier pawn a joué
                    this.game.turnManager.endTurn().then((nextPawn) => {
                        this.game.orderManager.resolveAll().then((res) => {
                            this.game.turnManager.initTurn(nextPawn, true);
                            this.game.process = false;
                            this.init();
                        });
                    });
                } else {
                    this.game.turnManager.endTurn().then((res) => {
                        this.game.turnManager.initTurn(res);
                        this.game.process = false;
                        this.init();
                    });
                }
            }
        }
    }
}
