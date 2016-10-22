module TacticArena.UI {
    export class Menu {
        game:State.Main;
        element;
        logsElement;
        menuElement;
        endTurnKey;

        constructor(game) {
            var self = this;
            this.game = game;
            this.element = document.querySelector('#content');
            this.logsElement = this.element.querySelector('.ui-logs');
            this.menuElement = this.element.querySelector('.ui-menu');

            this.logsElement.addEventListener('mouseover', function() {
                self.menuOver();
            });
            this.logsElement.addEventListener('mouseout', function() {
                self.menuOut();
            });

            this.menuElement.addEventListener('mouseover', function() {
                self.menuOver();
            });
            this.menuElement.addEventListener('mouseout', function() {
                self.menuOut();
            });

            this.getButton('submit').addEventListener('click', function() {
                self.endTurn();
            });
            this.getButton('cancel').addEventListener('click', function() {
                self.cancelAction();
            });
            this.getButton('walk').addEventListener('click', function() {
                self.deselectAll();
                self.getButton('walk').classList.add('selected');
            });
            this.getButton('wait').addEventListener('click', function() {
                self.deselectAll();
                self.getButton('wait').classList.add('selected');
            });

            this.endTurnKey = this.game.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR);
            this.endTurnKey.onDown.add(this.endTurn ,this);

            this.init();
        }

        init() {
            this.getButton('walk').click();
            var activePawn = this.game.turnManager.getActivePawn();
            this.write('au tour de Player_0'+activePawn._id);
        }

        write(msg) {
            this.element.querySelector('.ui-logs').innerHTML += msg + '<br/>';
        }

        getButton(name) {
            return this.element.querySelector('.ui-menu .'+name);
        }

        deselectAll() {
            var buttons = this.element.querySelectorAll('.ui-menu li');
            for(var i=0; i < buttons.length; i++) {
                buttons[i].classList.remove('selected');
            }
        }

        menuOver() {
            this.game.pointer.hide();
            
        }

        menuOut() {
            this.game.pointer.show();
        }


        cancelAction() {
            var activePawn = this.game.turnManager.getActivePawn();
            activePawn.resetToGhostPosition();
            //this.game.orderManager.removeEntityOrder(activePawn);
        }

        endTurn() {           
            var activePawn = this.game.turnManager.getActivePawn();
            if(!this.game.orderManager.hasOrder(activePawn._id)) {
                this.game.orderManager.add('stand', activePawn, null, null);
            }
            activePawn.hide();
            if (!this.game.process) {        
                this.game.process = true;
                console.log(this.game.orderManager.orders.length);
                if(this.game.orderManager.orders.length == this.game.pawns.length) {
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
