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
            this.game = game;
            this.element = document.querySelector('#content');

            this.logsUI = new UI.Logs(this);
            this.directionUI = new UI.Direction(this);
            this.actionUI = new UI.Action(this);
            this.pawnsinfosUI = new UI.PawnsInfos(this);

            this.game.pointer.dealWith(this.logsUI.element);
            this.game.pointer.dealWith(this.actionUI.element);
            this.game.pointer.dealWith(this.directionUI.element);

            this.endTurnKey = this.game.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR);
            this.endTurnKey.onDown.add(this.endTurn ,this);

            this.logsUI.write('<b>Tactic Arena</b>');
            this.init();
        }

        init() {
            var activePawn = this.game.turnManager.getActivePawn();
            this.directionUI.init(activePawn.getDirection());
            this.actionUI.init();
            this.logsUI.write('au tour du joueur ' + activePawn._id);
            this.pawnsinfosUI.select(activePawn._id);
        }

        cancelAction() {
            var activePawn = this.game.turnManager.getActivePawn();
            activePawn.resetToGhostPosition();
            activePawn.ap = 2;
            this.game.orderManager.removeEntityOrder(activePawn._id);
            this.game.orderManager.add('stand_' + activePawn.getDirection(), activePawn, null, null);
        }

        endTurn() {
            var activePawn = this.game.turnManager.getActivePawn();
            if(!this.game.orderManager.hasOrder(activePawn._id)) {
                console.log('force add order if none exists');
                this.game.orderManager.add('stand_' + activePawn.getDirection(), activePawn, null, null);
            }
            if (!this.game.process) {
                this.game.process = true;
                if (activePawn._id == this.game.pawns[this.game.pawns.length-1]._id) {
                    this.game.orderManager.resolveAll().then((res) => {
                        this.game.turnManager.endTurn().then((res) => {
                            this.game.turnManager.initTurn(res, true);
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
