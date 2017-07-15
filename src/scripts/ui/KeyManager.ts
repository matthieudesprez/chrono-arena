module TacticArena.UI {
    export class KeyManager {
        menu;
        enterKey;
        leftKey;
        rightKey;
        downKey;
        upKey;
        backKey;
        spacebarKey;
        pKey;
        oneKey;
        twoKey;
        threeKey;
        fourKey;
        fiveKey;
        wKey;

        constructor(menu) {
            this.menu = menu;
            this.setEvents();
        }

        setEvents() {
            this.enterKey = this.menu.game.input.keyboard.addKey(Phaser.KeyCode.ENTER);
            this.enterKey.onDown.add(this.enterKeyPressed, this, 0, this.menu);

            this.spacebarKey = this.menu.game.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR);
            this.spacebarKey.onDown.add(this.pauseResolve, this, 0, this.menu);

            this.leftKey = this.menu.game.input.keyboard.addKey(Phaser.KeyCode.LEFT);
            this.leftKey.onDown.add(this.leftKeyPressed, this, 0, this.menu);

            this.rightKey = this.menu.game.input.keyboard.addKey(Phaser.KeyCode.RIGHT);
            this.rightKey.onDown.add(this.rightKeyPressed, this, 0, this.menu);

            this.downKey = this.menu.game.input.keyboard.addKey(Phaser.KeyCode.DOWN);
            this.downKey.onDown.add(this.downKeyPressed, this, 0, this.menu);

            this.upKey = this.menu.game.input.keyboard.addKey(Phaser.KeyCode.UP);
            this.upKey.onDown.add(this.upKeyPressed, this, 0, this.menu);

            this.backKey = this.menu.game.input.keyboard.addKey(Phaser.KeyCode.BACKSPACE);
            this.backKey.onDown.add(this.backKeyPressed, this, 0, this.menu);

            this.pKey = this.menu.game.input.keyboard.addKey(Phaser.KeyCode.P);
            this.pKey.onDown.add(this.pKeyPress, this, 0, this.menu);

            this.oneKey = this.menu.game.input.keyboard.addKey(Phaser.KeyCode.ONE);
            this.oneKey.onDown.add(this.oneKeyPress, this, 0, this.menu);

            this.twoKey = this.menu.game.input.keyboard.addKey(Phaser.KeyCode.TWO);
            this.twoKey.onDown.add(this.twoKeyPress, this, 0, this.menu);

            this.threeKey = this.menu.game.input.keyboard.addKey(Phaser.KeyCode.THREE);
            this.threeKey.onDown.add(this.threeKeyPress, this, 0, this.menu);

            this.fourKey = this.menu.game.input.keyboard.addKey(Phaser.KeyCode.FOUR);
            this.fourKey.onDown.add(this.fourKeyPress, this, 0, this.menu);

            this.fiveKey = this.menu.game.input.keyboard.addKey(Phaser.KeyCode.FIVE);
            this.fiveKey.onDown.add(this.fiveKeyPress, this, 0, this.menu);

            this.wKey = this.menu.game.input.keyboard.addKey(Phaser.KeyCode.W);
            this.wKey.onDown.add(this.wKeyPress, this, 0, this.menu);
        }

       leftKeyPressed(self, uiManager) {
           if(uiManager.process) return false;
            if(uiManager.game.resolveManager.active && !uiManager.game.resolveManager.processing) {
                uiManager.timeUI.goBackward();
            } else if (!uiManager.game.process) {
                uiManager.directionUI.changeDirection('W');
            }
        }
        rightKeyPressed(self, uiManager) {
            if(uiManager.process) return false;
            if(uiManager.game.resolveManager.active && !uiManager.game.resolveManager.processing) {
                uiManager.timeUI.goForward();
            } else if (!uiManager.game.process) {
                uiManager.directionUI.changeDirection('E');
            }
        }
        upKeyPressed(self, uiManager) {
            if(uiManager.process) return false;
            if (!uiManager.game.process) {
                uiManager.directionUI.changeDirection('N');
            }
        }
        downKeyPressed(self, uiManager) {
            if(uiManager.process) return false;
            if (!uiManager.game.process) {
                uiManager.directionUI.changeDirection('S');
            }
        }

        enterKeyPressed(self, uiManager) {
            if(uiManager.process) {
                uiManager.transitionUI.hide(200);
                return false;
            }
            if(uiManager.game.resolveManager.active && !uiManager.game.resolveManager.processing) {
                uiManager.process = true;
                uiManager.game.isPaused = false;
                uiManager.timeUI.goForward();
            } else if (!uiManager.game.process) {
                uiManager.endOrderPhase();
            }
        }

        backKeyPressed(self, uiManager) {
            uiManager.cancelAction();
        }

        pauseResolve(self, uiManager) {
            uiManager.timeUI.togglePause();
        }

        pKeyPress(self, uiManager) {
            if(self.altKey) {
                uiManager.game.hideProjections = !uiManager.game.hideProjections;
            }
        }
        oneKeyPress(self, uiManager) {
            if(self.altKey) {
                $('.pawn:nth-child(1)').trigger('click');
            } else {
                uiManager.actionUI.wait();
            }
        }
        twoKeyPress(self, uiManager) {
            if(self.altKey) {
                $('.pawn:nth-child(2)').trigger('click');
            } else {
                uiManager.actionUI.select('walk');
            }
        }
        threeKeyPress(self, uiManager) {
            if(self.altKey) {
                $('.pawn:nth-child(3)').trigger('click');
            } else {
                uiManager.actionUI.select('slash');
            }
        }
        fourKeyPress(self, uiManager) {
            if(self.altKey) {
                $('.pawn:nth-child(4)').trigger('click');
            } else {
                uiManager.actionUI.select('fire');
            }
        }
        fiveKeyPress(self, uiManager) {
            if(self.altKey) {
                $('.pawn:nth-child(5)').trigger('click');
            } else {
                uiManager.actionUI.select('wind');
            }
        }
        wKeyPress(self, uiManager) {
            if(self.altKey) {
                uiManager.game.battleOver();
            }
        }
    }
}
