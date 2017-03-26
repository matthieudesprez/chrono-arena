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
        }

        init() {
            var self = this;

            this.onApChange.add(function() {
                self.game.uiManager.pawnsinfosUI.updateInfos();
            });

            this.onHpChange.add(function() {
                self.game.uiManager.pawnsinfosUI.updateInfos();
            });

            this.onOrderChange.add(function(pawn) {
                //self.game.uiManager.pawnsinfosUI.updateOrders(pawn, self.game.orderManager.orders);
                self.game.uiManager.ordersnotificationsUI.update(self.game.orderManager.getOrders(pawn._id).length - 1);
            });

            this.onActionPlayed.add(function(pawn) {
                self.game.pointer.update();
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
            });
        }
    }
}
