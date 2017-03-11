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

        constructor(menu) {
            this.menu = menu;

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
            if(uiManager.process) return false;
            console.info(uiManager.game.resolveManager.active, uiManager.game.resolveManager.processing);
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
    }
}
