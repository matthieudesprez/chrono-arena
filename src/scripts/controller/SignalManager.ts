module TacticArena {
    export class SignalManager {
        game;
        onMpChange:Phaser.Signal;
        onApChange:Phaser.Signal;
        onHpChangeMenu:Phaser.Signal;
        onHpChangeAnimation:Phaser.Signal;
        onOrderChange:Phaser.Signal;
        onActionPlayed:Phaser.Signal;
        stepResolutionIndexChange:Phaser.Signal;
        onActivePawnChange:Phaser.Signal;
        onTeamChange:Phaser.Signal;
        onChatMessageReception:Phaser.Signal;

        constructor(game) {
            this.game = game;

            this.onMpChange = new Phaser.Signal();
            this.onApChange = new Phaser.Signal();
            this.onHpChangeMenu = new Phaser.Signal();
            this.onHpChangeAnimation = new Phaser.Signal();
            this.onOrderChange = new Phaser.Signal();
            this.onActionPlayed = new Phaser.Signal();
            this.stepResolutionIndexChange = new Phaser.Signal();
            this.onActivePawnChange = new Phaser.Signal();
            this.onTeamChange = new Phaser.Signal();
            this.onChatMessageReception = new Phaser.Signal();
        }

        init() {
            var self = this;

            this.onMpChange.add(function(pawn) {
                if (self.game.uiManager.actionMenu) {
                    self.game.uiManager.actionMenu.showCost(pawn, 'mp', 0);
                }
                self.game.uiManager.topMenu.updateMp(pawn);
            });

            this.onApChange.add(function(pawn) {
                if (self.game.uiManager.actionMenu) {
                    self.game.uiManager.actionMenu.showCost(pawn, 'ap', 0);
                }
                self.game.uiManager.topMenu.updateAp(pawn);
            });

            this.onHpChangeMenu.add(function(pawn) {
                self.game.uiManager.topMenu.updateHp(pawn);
            });

            this.onHpChangeAnimation.add(function(pawn, forceAnimation) {
                if ((pawn.isAlive() || forceAnimation) && pawn.getHp() <= 0) {
                    self.game.spritesManager.sprites[pawn._id].die();
                }
            });

            this.onOrderChange.add(function(pawn) {
                self.game.uiManager.ordersnotificationsUI.update(self.game.orderManager.getOrders(pawn));
                if(self.game.uiManager.actionMenu) {
                    self.game.uiManager.actionMenu.enableConfirm();
                    if (self.game.orderManager.getOrders(pawn).length > 0) {
                        self.game.uiManager.actionMenu.enableCancel();
                    } else {
                        self.game.uiManager.actionMenu.disableCancel();
                    }
                    self.game.uiManager.actionMenu.update();
                }
            });

            this.onActionPlayed.add(function(pawn) {
                self.game.pointer.update();
            });

            this.stepResolutionIndexChange.add(function(stepIndex) {
                //self.game.uiManager.notificationsUI.update(stepIndex);
                if (self.game.uiManager.timelineMenu) {
                    self.game.uiManager.timelineMenu.update(stepIndex);
                }
            });

            this.onActivePawnChange.add(function(activePawn) {
                self.game.uiManager.ordersnotificationsUI.clean();
                self.game.uiManager.ordersnotificationsUI.update(self.game.orderManager.getOrders(activePawn));

                let position = self.game.spritesManager.getReal(activePawn).getPosition();

                self.game.uiSpritesGroup.removeAll();
                let s = self.game.uiSpritesGroup.create(position.x * self.game.game.tileSize - 1, position.y * self.game.game.tileSize + 15, 'circle');
                s.animations.add('turn', ["selected_circle_01", "selected_circle_02"], 4, true);
                s.play('turn');

                if(self.game.uiManager.actionMenu) { self.game.uiManager.actionMenu.clean(); }
                self.game.uiManager.actionMenu = new UI.ActionMenu(self.game, activePawn);
            });

            this.onChatMessageReception.add(function(data) {
                self.game.uiManager.chatUI.write(data.name + ': ' + data.message)
            });
        }
    }
}
