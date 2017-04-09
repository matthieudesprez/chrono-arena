module TacticArena.Controller {
    export class SignalManager {
        game;
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

        constructor(game) {
            this.game = game;

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
        }

        init() {
            var self = this;

            this.onApChange.add(function() {
                self.game.uiManager.pawnsinfosUI.updateInfos();
            });

            this.onHpChange.add(function(pawn) {
                self.game.uiManager.pawnsinfosUI.updateInfos();
                self.game.stageManager.handleTile(pawn);
            });

            this.onOrderChange.add(function(pawn) {
                self.game.uiManager.ordersnotificationsUI.update(self.game.orderManager.getOrders(pawn._id));
            });

            this.onActionPlayed.add(function(pawn) {
                self.game.pointer.update();
                self.game.uiManager.actionUI.update(pawn.getAp());
            });

            this.turnInitialized.add(function(pawn) {
                self.game.process = false;
                if(pawn.isBot) {
                    self.game.aiManager.play(pawn);
                } else {
                    self.game.selecting = true;
                }
            });

            this.stepResolutionFinished.add(function(stepIndex) {
                self.game.uiManager.process = false;
            });

            this.resolvePhaseFinished.add(function() {
                self.game.isGameReadyPromise().then((res) => {
                    self.game.uiManager.endResolvePhase();
                });
            });

            this.stepResolutionIndexChange.add(function(stepIndex) {
                self.game.uiManager.notificationsUI.update(stepIndex);
                self.game.uiManager.timelineUI.update(stepIndex);
            });

            this.onTurnEnded.add(function(activePawn) {
                self.game.uiManager.ordersnotificationsUI.clean();
                self.game.uiSpritesGroup.removeAll();
            });

            this.onActivePawnChange.add(function(activePawn) {
                self.game.uiManager.ordersnotificationsUI.clean();
                self.game.uiManager.ordersnotificationsUI.update(self.game.orderManager.getOrders(activePawn._id));
                self.game.uiManager.pawnsinfosUI.select(activePawn._id);
                self.game.uiManager.directionUI.init(activePawn.getDirection());
                self.game.uiManager.actionUI.update(activePawn.getAp());
                self.game.uiManager.actionUI.select('walk');

                let position = activePawn.getPosition();

                self.game.uiSpritesGroup.removeAll();
                let s = self.game.uiSpritesGroup.create(position.x * self.game.tileSize - 1, position.y * self.game.tileSize + 15, 'circle');
                s.animations.add('turn', ["selected_circle_01", "selected_circle_02"], 4, true);
                s.play('turn');
                //this.consolelogsUI.write('au tour du joueur ' + activePawn._id);
            });

            this.onTeamChange.add(function() {
                if(self.game.hideProjections) {
                    self.game.pawns.forEach(function (pawn) {
                        pawn.destroyProjection();
                    });
                }
            });

            this.onChatMessageReception.add(function(data) {
                console.log(data);
                self.game.uiManager.chatUI.write(data.name + ': ' + data.message)
            });
        }
    }
}
