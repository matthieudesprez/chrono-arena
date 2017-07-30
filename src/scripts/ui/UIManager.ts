module TacticArena.UI {
    export class UIManager {
        game;
        element;
        directionUI;
        timeUI;
        timelineUI;
        pawnsinfosUI;
        keyManager;
        notificationsUI;
        ordersnotificationsUI;
        transitionUI;
        turnIndicatorUI;
        ingamemenuUI;
        process;

        constructor(game) {
            var self = this;
            this.game = game;

            this.element = $('#content');

            var topUIGroup = this.game.add.group();
            var topUIBackground = this.game.make.graphics();
            topUIBackground.beginFill(0x333333, 0.6);
            topUIBackground.drawRect(0, 0, this.game.world.width, 64);
            topUIBackground.endFill();
            topUIGroup.add(topUIBackground);

            this.game.uiGroup.add(topUIGroup);

            this.directionUI = new UI.Direction(this);
            this.timeUI = new UI.Time(this);
            this.timelineUI = new UI.TimeLine(this);
            this.pawnsinfosUI = new UI.PawnsInfos(this);
            this.keyManager = new UI.KeyManager(this);
            this.notificationsUI = new UI.Notifications(this);
            this.ordersnotificationsUI = new UI.OrdersNotifications(this);
            this.transitionUI = new UI.Transition(this);
            this.turnIndicatorUI = new UI.TurnIndicator(this);
            this.ingamemenuUI = new UI.IngameMenu(this);

            this.game.pointer.dealWith(this.timeUI.element);
            this.game.pointer.dealWith(this.timelineUI.element);
            this.game.pointer.dealWith(this.directionUI.element);

            this.process = false;
        }

        initOrderPhase(pawn, first) {
            if(first) {
                this.game.orderManager.orders = [];
            }
            this.game.turnManager.init(pawn, first).then((data) => {
                if(first) {
                    this.turnIndicatorUI.write(this.game.turnManager.currentTurnIndex + 1);
                    this.transitionUI.show('Phase de commandement').then( (res) => {
                        this.directionUI.show();
                        return true;
                    });
                }
                this.game.signalManager.turnInitialized.dispatch(pawn);
            });
        }

        endOrderPhase() {
            if (!this.game.process) {
                this.game.process = true;
                this.game.selecting = false;
                this.game.stageManager.clearPossibleMove();
                this.game.stageManager.clearPath(this.game.pathTilesGroup);
                let activePawn = this.game.turnManager.getActivePawn();
                this.game.turnManager.endTurn().then((nextPawn) => {
                    this.game.signalManager.onTurnEnded.dispatch(activePawn);
                    if(this.game.playMode == 'online' && this.game.turnManager.getRemainingPawns(this.game.playerTeam).length == 0) {
                        // s'il reste plus de pawn à jouer du playerteam
                        // alors on signale au serveur qu'on a fini la phase de commandement
                        // en lui envoyant les ordres
                        this.game.serverManager.request('VALID_ORDER_PHASE', {
                            turn: this.game.turnManager.currentTurnIndex,
                            orders: this.game.orderManager.getPlayerOrders(this.game.playerTeam)
                        });
                        this.ingamemenuUI.show('Waiting for opponent move');
                    } else {
                        if (this.game.turnManager.getRemainingPawns().length == 0) {
                            let steps = this.game.orderManager.getSteps();
                            this.initResolvePhase(steps);
                        } else {
                            this.initOrderPhase(nextPawn, false);
                        }
                    }
                });
            }
        }

        initResolvePhase(steps) {
            this.ingamemenuUI.close();
            this.directionUI.clean();
            this.game.resolveManager.init(steps);
            this.transitionUI.show('Phase de Résolution').then((res) => {
                return true;
            }).then((res) => {
                this.pawnsinfosUI.selectAll();
                this.game.logManager.add(steps);
                this.timelineUI.build(<any>steps.length).then((res) => {
                    this.game.resolveManager.processSteps(0);
                });
            });
        }

        endResolvePhase() {
            var self = this;
            for(var i = 0; i < this.game.pawns.length; i++) {
                this.game.pawns[i].destroyProjection();
            }
            this.game.resolveManager.active = false;
            setTimeout(function() {
                self.notificationsUI.clean();
            }, 500);
            this.timelineUI.clean();
            this.timeUI.updatePauseFromSelected();
            if(this.game.isOver()) {
                let msg = this.game.teams[this.game.playerTeam] ? 'You win' : 'You lose';
                this.ingamemenuUI.gameOver(msg);
                this.game.battleOver();
            } else {
                this.initOrderPhase(this.game.getFirstAlive(), true);
            }

        }

        cancelAction() {
            if(!this.game.process) {
                var activePawn = this.game.turnManager.getActivePawn();
                activePawn.show();
                activePawn.destroyProjection();
                activePawn.setAp(3);
                activePawn.getProjectionOrReal().faceDirection(this.directionUI.savedDirection);
                this.directionUI.init(this.directionUI.savedDirection);
                this.game.orderManager.removeEntityOrder(activePawn);
                this.game.signalManager.onActionPlayed.dispatch(activePawn);
            }
        }
    }
}
