module TacticArena {
    export class SignalManager {
        game;
        onMpChange:Phaser.Signal;
        onApChange:Phaser.Signal;
        onHpChange:Phaser.Signal;
        onOrderChange:Phaser.Signal;
        onActionPlayed:Phaser.Signal;
        turnInitialized:Phaser.Signal;
        stepResolutionFinished:Phaser.Signal;
        resolvePhaseFinished:Phaser.Signal;
        stepResolutionIndexChange:Phaser.Signal;
        onTurnEnded:Phaser.Signal;
        onActivePawnChange:Phaser.Signal;
        onTeamChange:Phaser.Signal;
        onChatMessageReception:Phaser.Signal;
        onProcessedOrders:Phaser.Signal;

        constructor(game) {
            this.game = game;

            this.onMpChange = new Phaser.Signal();
            this.onApChange = new Phaser.Signal();
            this.onHpChange = new Phaser.Signal();
            this.onOrderChange = new Phaser.Signal();
            this.onActionPlayed = new Phaser.Signal();
            this.turnInitialized = new Phaser.Signal();
            this.stepResolutionFinished = new Phaser.Signal();
            this.resolvePhaseFinished = new Phaser.Signal();
            this.stepResolutionIndexChange = new Phaser.Signal();
            this.onTurnEnded = new Phaser.Signal();
            this.onActivePawnChange = new Phaser.Signal();
            this.onTeamChange = new Phaser.Signal();
            this.onChatMessageReception = new Phaser.Signal();
            this.onProcessedOrders = new Phaser.Signal();
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

            this.onHpChange.add(function(pawn) {
                self.game.stageManager.handleTile(pawn);
                self.game.uiManager.topMenu.updateHp(pawn);
            });

            this.onOrderChange.add(function(pawn) {
                self.game.uiManager.ordersnotificationsUI.update(self.game.orderManager.getOrders(pawn._id));
                self.game.uiManager.actionMenu.enableConfirm();
                if(self.game.orderManager.getOrders(pawn._id).length > 0) {
                    self.game.uiManager.actionMenu.enableCancel();
                } else {
                    self.game.uiManager.actionMenu.disableCancel();
                }
                self.game.uiManager.actionMenu.update();
            });

            this.onActionPlayed.add(function(pawn) {
                self.game.pointer.update();
            });

            this.turnInitialized.add(function(pawn) {
                self.game.process = false;
                self.game.selecting = true;
                if(pawn.isBot) {
                    self.game.aiManager.play(pawn);
                } else {
                    //self.game.selecting = true;
                }
            });

            this.stepResolutionFinished.add(function(stepIndex) {
                self.game.uiManager.process = false;
                self.game.resolveManager.processing = false; // On repasse process à false pour regagner la main sur le ResolveManager
            });

            this.resolvePhaseFinished.add(function() {
                self.game.isGameReadyPromise().then((res) => {
                    Action.ConfirmResolve.process(self.game);
                });
            });

            this.stepResolutionIndexChange.add(function(stepIndex) {
                //self.game.uiManager.notificationsUI.update(stepIndex);
                if (self.game.uiManager.timelineMenu) {
                    self.game.uiManager.timelineMenu.update(stepIndex);
                }
            });

            this.onTurnEnded.add(function(activePawn) {
                self.game.uiManager.ordersnotificationsUI.clean();
                self.game.uiSpritesGroup.removeAll();
                if(self.game.uiManager.actionMenu) {
                    self.game.uiManager.actionMenu.clean();
                    self.game.uiManager.actionMenu = null;
                }
            });

            this.onActivePawnChange.add(function(activePawn) {
                self.game.uiManager.ordersnotificationsUI.clean();
                self.game.uiManager.ordersnotificationsUI.update(self.game.orderManager.getOrders(activePawn._id));
                //self.game.uiManager.pawnsinfosUI.select(activePawn._id);
                //self.game.uiManager.actionUI.update(activePawn.getAp());
                //self.game.uiManager.actionUI.select('walk');

                let position = self.game.spritesManager.getReal(activePawn).getPosition();

                self.game.uiSpritesGroup.removeAll();
                let s = self.game.uiSpritesGroup.create(position.x * self.game.game.tileSize - 1, position.y * self.game.game.tileSize + 15, 'circle');
                s.animations.add('turn', ["selected_circle_01", "selected_circle_02"], 4, true);
                s.play('turn');
                //this.consolelogsUI.write('au tour du joueur ' + activePawn._id);

                self.game.uiManager.actionMenu = new UI.ActionMenu(self.game, activePawn);
            });

            this.onTeamChange.add(function() {
                if(self.game.hideProjections) {
                    self.game.pawns.forEach(function (pawn) {
                        pawn.destroyProjection();
                    });
                }
            });

            this.onChatMessageReception.add(function(data) {
                self.game.uiManager.chatUI.write(data.name + ': ' + data.message)
            });

            this.onProcessedOrders.add(function(steps) {
                self.game.uiManager.initResolvePhase(steps);
                self.game.logManager.add(steps);
            });
        }
    }
}
