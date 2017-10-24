module TacticArena.UI {
    export class KeyManager {
        menu;
        enterKey;
        backKey;
        spacebarKey;
        dKey;
        pKey;
        wKey;
        escapeKey;

        constructor(menu) {
            this.menu = menu;

            this.enterKey = this.menu.game.input.keyboard.addKey(Phaser.KeyCode.ENTER);
            this.enterKey.onDown.add(this.enterKeyPressed, this, 0, this.menu);

            this.spacebarKey = this.menu.game.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR);
            this.spacebarKey.onDown.add(this.pauseResolve, this, 0, this.menu);

            this.backKey = this.menu.game.input.keyboard.addKey(Phaser.KeyCode.BACKSPACE);
            this.backKey.onDown.add(this.backKeyPressed, this, 0, this.menu);

            this.dKey = this.menu.game.input.keyboard.addKey(Phaser.KeyCode.D);
            this.dKey.onDown.add(this.dKeyPress, this, 0, this.menu);

            this.pKey = this.menu.game.input.keyboard.addKey(Phaser.KeyCode.P);
            this.pKey.onDown.add(this.pKeyPress, this, 0, this.menu);

            this.wKey = this.menu.game.input.keyboard.addKey(Phaser.KeyCode.W);
            this.wKey.onDown.add(this.wKeyPress, this, 0, this.menu);

            this.escapeKey = this.menu.game.input.keyboard.addKey(Phaser.KeyCode.ESC);
            this.escapeKey.onDown.add(this.escapeKeyPress, this, 0, this.menu);
        }

        enterKeyPressed(self, uiManager) {
            if(uiManager.game.resolveManager.active && !uiManager.game.resolveManager.processing) {
                uiManager.process = true;
                uiManager.game.isPaused = false;
                Action.Timeline.GoForward.process(uiManager.game);
            } else if (!uiManager.game.process) {
                Action.ConfirmOrder.process(uiManager.game);
            }
        }

        backKeyPressed(self, uiManager) {
            Action.Cancel.process(uiManager.game);
        }
        escapeKeyPress(self, uiManager) {
            Action.Cancel.process(uiManager.game);
        }

        pauseResolve(self, uiManager) {
            Action.Timeline.TogglePause.process(uiManager.game);
        }

        pKeyPress(self, uiManager) {
            if(self.altKey) {
                uiManager.game.hideProjections = !uiManager.game.hideProjections;
            }
        }

        dKeyPress(self, uiManager) {
            if(self.altKey) {
                uiManager.game.debugMode = !uiManager.game.debugMode;
            }
        }

        wKeyPress(self, uiManager) {
            if(self.altKey) {
                uiManager.game.battleOver();
            }
        }
    }
}
