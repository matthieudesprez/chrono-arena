module TacticArena.UI {
    export class KeyManager {
        menu;
        enterKey;
        leftKey;
        rightKey;
        downKey;
        upKey;
        cancelKey;
        pauseKey;

        constructor(menu) {
            this.menu = menu;

            this.enterKey = this.menu.game.input.keyboard.addKey(Phaser.KeyCode.ENTER);
            this.enterKey.onDown.add(this.enterKeyPressed, this, 0, this.menu);

            this.pauseKey = this.menu.game.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR);
            this.pauseKey.onDown.add(this.pauseResolve, this, 0, this.menu);

            this.leftKey = this.menu.game.input.keyboard.addKey(Phaser.KeyCode.LEFT);
            this.leftKey.onDown.add(this.leftKeyPressed, this, 0, this.menu);

            this.rightKey = this.menu.game.input.keyboard.addKey(Phaser.KeyCode.RIGHT);
            this.rightKey.onDown.add(this.rightKeyPressed, this, 0, this.menu);

            this.downKey = this.menu.game.input.keyboard.addKey(Phaser.KeyCode.DOWN);
            this.downKey.onDown.add(this.downKeyPressed, this, 0, this.menu);

            this.upKey = this.menu.game.input.keyboard.addKey(Phaser.KeyCode.UP);
            this.upKey.onDown.add(this.upKeyPressed, this, 0, this.menu);

            this.cancelKey = this.menu.game.input.keyboard.addKey(Phaser.KeyCode.BACKSPACE);
            this.cancelKey.onDown.add(this.cancelAction, this, 0, this.menu);
        }

       leftKeyPressed(self, uiManager) {
            if(uiManager.game.resolveManager.active) {
                uiManager.timeUI.goBackward();
            } else if (!uiManager.game.process) {
                uiManager.directionUI.changeDirection('W');
            }
        }
        rightKeyPressed(self, uiManager) {
            if(uiManager.game.resolveManager.active) {
                uiManager.timeUI.goForward();
            } else if (!uiManager.game.process) {
                uiManager.directionUI.changeDirection('E');
            }
        }
        upKeyPressed(self, uiManager) {
            if(uiManager.game.resolveManager.active) {

            } else if (!uiManager.game.process) {
                uiManager.directionUI.changeDirection('N');
            }
        }
        downKeyPressed(self, uiManager) {
            if(uiManager.game.resolveManager.active) {

            } else if (!uiManager.game.process) {
                uiManager.directionUI.changeDirection('S');
            }
        }

        enterKeyPressed(self, uiManager) {
            if(uiManager.game.resolveManager.active) {
                //this.timeUI.togglePause();
                uiManager.game.isPaused = false;
                uiManager.timeUI.goForward();
            } else if (!uiManager.game.process) {
                uiManager.endTurn();
            }
        }

        cancelAction(self, uiManager) {
            if(!uiManager.game.process) {
                var activePawn = uiManager.game.turnManager.getActivePawn();
                activePawn.show();
                activePawn.destroyProjection();
                activePawn.setAp(3);
                activePawn.getProjectionOrReal().faceDirection(uiManager.directionUI.savedDirection);
                uiManager.directionUI.init(uiManager.directionUI.savedDirection);
                uiManager.game.orderManager.removeEntityOrder(activePawn);
                uiManager.game.onActionPlayed.dispatch(activePawn);
            }
        }

        pauseResolve(self, uiManager) {
            uiManager.timeUI.togglePause();
        }
    }
}
