/// <reference path="BasePlayable.ts"/>
module TacticArena.State {
    export class BaseBattle extends TacticArena.State.BasePlayable {
        turnManager: TurnManager;
        orderManager: OrderManager;
        resolveManager: ResolveManager;
        logManager: LogManager;
        signalManager: SignalManager;
        aiManager: AiManager;
        uiManager: UI.UIManager;
        selecting: Boolean;
        hideProjections: Boolean;
        serverManager: ServerManager;
        teamsStates;
        chatUI;
        playMode;
        gridWidth;
        gridHeight;

        constructor() {
            super();
        }

        init(data?, chat?, server?) {
            super.init(data);
            this.selecting = false;
            this.hideProjections = false;
            this.teamsStates = {};
            this.signalManager = new SignalManager(this);
            this.signalManager.init();
            this.pointer = new UI.Pointer(this);
        }

        create() {
            super.create();
            this.logManager = new LogManager(this);
            this.orderManager = new OrderManager(this);
            this.resolveManager = new ResolveManager(this);
            this.turnManager = new TurnManager(this);
            this.uiManager = new UI.UIManager(this);
            if (this.chatUI) {
                this.chatUI.menu = this.uiManager;
            }
            this.initOrderPhase(this.turnManager.getNextPawn(), true);
        }

        /*
         Init the order phase during which the players can plan orders for their pawns and confirm them
         */
        initOrderPhase(pawn: Champion.BaseChampion, first: boolean): void {
            if (first) {
                this.orderManager.orders = [];
            }
            this.turnManager.init(pawn, first).then(res => {
                if (first) {
                    this.uiManager.turnIndicatorUI.write(this.turnManager.currentTurnIndex + 1);
                    return this.uiManager.transitionUI.show('PLAN');
                }
                return true;
            }).then(res => {
                this.process = false;
                this.selecting = true;
                if (this.turnManager.getActivePlayer().isBot) {
                    this.aiManager.play(pawn);
                }
            });
        }

        /*
         Init the resolve phase which is a step by step representation of what results from the orderManager processing
         */
        initResolvePhase(steps): void {
            this.resolveManager.init(steps);
            this.uiManager.transitionUI.show('EXECUTION').then(res => {
                return res;
            }).then(res => {
                this.uiManager.timelineMenu = new UI.TimelineMenu(this);
                return this.uiManager.timelineMenu.init(<any>steps.length);
            }).then(res => {
                this.resolveManager.processSteps(0);
            });
        }

        /*
         Return a promise, which resolve when the game is not paused
         */
        isGameReady(): Promise<any> {
            var self = this;
            return new Promise((resolve, reject) => {
                (function isReady() {
                    if (!self.isPaused) resolve();
                    setTimeout(isReady, 300);
                })();
            });
        }

        /*
         Return true if there is 1 or 0 player remaining (all the other's pawns are dead)
         */
        getRemainingPlayers(): Player.BasePlayer[] {
            return this.players.filter((player: Player.BasePlayer) => {
                return this.pawns.filter((pawn: Champion.BaseChampion) => {
                        return pawn.isAlive() && pawn.team === player._id
                    }).length > 0;
            });
        }

        /*
         Return true if there is 1 or 0 players remaining (all the other's pawns are dead)
         */
        isOver(): boolean {
            return this.getRemainingPlayers().length <= 1;
        }

        /*
         Return a text representing the result of the battle
         */
        getResult(): string {
            let result = 'Fighting';
            let remaingPlayers = this.getRemainingPlayers();
            if (remaingPlayers.length === 0) {
                result = 'Draw';
            }
            else if (remaingPlayers.length === 1) {
                result = remaingPlayers[0].name + '\nWins';
            }
            return result;
        }

        /*
         Return a unique id, which is for now the index of the pawn in this.pawns
         */
        getUniqueId() {
            return this.pawns.length;
        }

        /*
         Show the battleOver modal
         */
        battleOver() {
            this.uiManager.modalUI.createGameOverModal();
            this.uiManager.dialogUI.showModal('battleOver');
        }

        getPlayablePlayers() {
            return this.players.filter((player: Player.BasePlayer) => {
                return player.isLocalPlayer;
            });
        }
    }
}
