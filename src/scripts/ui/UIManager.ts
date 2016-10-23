module TacticArena.UI {
    export class UIManager {
        game:State.Main;
        element;
        logsElement;
        directionUI;
        actionUI;
        endTurnKey;

        constructor(game) {
            this.game = game;
            this.element = document.querySelector('#content');

            this.logsElement = this.element.querySelector('.ui-logs');
            this.directionUI = new UI.Direction(this);
            this.actionUI = new UI.Action(this);

            this.game.pointer.dealWith(this.logsElement);
            this.game.pointer.dealWith(this.actionUI.element);
            this.game.pointer.dealWith(this.directionUI.element);

            this.endTurnKey = this.game.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR);
            this.endTurnKey.onDown.add(this.endTurn ,this);

            this.init();
        }

        init() {
            var activePawn = this.game.turnManager.getActivePawn();
            this.directionUI.init(activePawn.getDirection());
            this.actionUI.init();
            this.write('au tour de Player_0' + activePawn._id);
        }

        write(msg) {
            this.element.querySelector('.ui-logs').innerHTML += msg + '<br/>';
        }

        cancelAction() {
            var activePawn = this.game.turnManager.getActivePawn();
            activePawn.resetToGhostPosition();
            this.game.orderManager.add('stand', activePawn, null, null);
        }

        endTurn() {           
            var activePawn = this.game.turnManager.getActivePawn();
            if(!this.game.orderManager.hasOrder(activePawn._id)) {
                console.log('forceadd');
                this.game.orderManager.add('stand', activePawn, null, null);
            }
            activePawn.hide();
            if (!this.game.process) {
                this.game.process = true;
                if (activePawn._id == this.game.pawns[this.game.pawns.length-1]._id) {
                    this.game.orderManager.resolveAll().then((res) => {
                        this.game.turnManager.endTurn().then((res) => {
                            this.game.turnManager.initTurn(res);
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
