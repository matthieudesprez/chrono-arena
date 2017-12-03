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

            this.logInformations();
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

        /*
        Shortcut to hide projections : alt + P
        Usefull with multiple local players to not show them previous orders
        Todo needs more work
         */
        pKeyPress(self, uiManager) {
            if(self.altKey) {
                uiManager.game.hideProjections = !uiManager.game.hideProjections;
            }
        }

        /*
         Shortcut to take control of the AI : alt + D
         Wont take effect on the current turn if AI has already played
         */
        dKeyPress(self, uiManager) {
            if(self.altKey) {
                uiManager.game.debugMode = !uiManager.game.debugMode;
                console.info('debug mode : ' + (uiManager.game.debugMode ? 'enabled' : 'disabled'));
            }
        }

        /*
        Shortcut to win a battle => alt + W
         */
        wKeyPress(self, uiManager) {
            if(self.altKey) {
                uiManager.game.players.filter( (player: Player.BasePlayer) => {
                    return player.isBot;
                }).forEach( (player: Player.BasePlayer) => {
                    uiManager.game.pawns.filter( (pawn: Champion.BaseChampion) => {
                        return pawn.team === player._id;
                    }).forEach((pawn:Champion.BaseChampion) => {
                        pawn.setHp(0);
                    });
                });
                uiManager.game.battleOver();
            }
        }

        logInformations(): void {
            console.info('take control of the AI (takes effect next turn if already played) : alt + D');
            console.info('win a battle : alt + W');
        }
    }
}
