/// <reference path="BasePlayable.ts"/>
module TacticArena.State {
    export class BaseBattle extends TacticArena.State.BasePlayable {
        turnManager: TurnManager;
        orderManager: OrderManager;
        resolveManager: ResolveManager;
        logManager: LogManager;
        signalManager: SignalManager;
        uiManager: UI.UIManager;
        selecting: Boolean;
        hideProjections: Boolean;
        teamColors;
        playerTeam;
        teams;
        chatUI;
        playMode;
        gridWidth;
        gridHeight;
        status;

        constructor() {
            super();
        }

        init(data?, chat?, server?) {
            super.init(data);
            this.selecting = false;
            this.hideProjections = false;
            this.teamColors = ['0x8ad886', '0xd68686', '0x87bfdb', '0xcdd385'];
            this.teams = {};
            //this.serializer = new TS.Serializer(TacticArena);
            this.signalManager = new SignalManager(this);
            this.signalManager.init();
            this.pointer = new UI.Pointer(this);
            this.status = 'Fighting';
        }

        create() {
            super.create();
            let self = this;

            this.logManager = new LogManager(this);
            this.orderManager = new OrderManager(this);
            this.resolveManager = new ResolveManager(this);
            this.turnManager = new TurnManager(this);
            this.uiManager = new UI.UIManager(this);
            if(this.chatUI) {
                this.chatUI.menu = this.uiManager;
            }

            let playerPawns = this.pawns.filter( pawn => { return pawn.team == self.playerTeam; });
            this.uiManager.initOrderPhase(playerPawns[0], true);
        }

        isGameReadyPromise() {
            var self = this;
            return new Promise((resolve, reject) => {
                (function isGameReady(){
                    if (!self.isPaused) return resolve();
                    setTimeout(isGameReady, 300);
                })();
            });
        }

        isOver() {
            //let everyoneElseIsDead = true;
            let ennemyPawnAlive = false;
            let allyPawnAlive = false;
            this.pawns.forEach( pawn => {
                this.teams[pawn.team] = true; //this.teams[pawn.team] || pawn.isAlive();
                //if(pawn.team != this.playerTeam) {
                //    everyoneElseIsDead = everyoneElseIsDead && !this.teams[pawn.team];
                //}
                if(pawn.team != this.playerTeam) {
                    if(pawn.isAlive()) { ennemyPawnAlive = true; }
                } else {
                    if(pawn.isAlive()) { allyPawnAlive = true; }
                }
            });
            if(!allyPawnAlive) { this.teams[this.playerTeam] = false; }
            return (!allyPawnAlive || !ennemyPawnAlive);
        }

        getUniqueId() {
            var id = 0; //Math.floor(Math.random() * 1000);
            var isUnique = false;
            while(!isUnique) {
                isUnique = true;
                id++;
                for(var i= 0; i < this.pawns.length; i++) {
                    if(this.pawns[i]._id && this.pawns[i]._id == id) {
                        isUnique = false;
                        break;
                    }
                }
            }
            return id;
        }

        getFirstAlive() {
            for(var i = 0; i < this.pawns.length; i++) {
                let p = this.pawns[i];
                if(p.team == this.playerTeam && p.isAlive()) {
                    return p;
                }
            }
            return null;
        }

        battleOver (status) {
            this.status = status;
            this.uiManager.dialogUI.createModal({
                type: "battleOver",
                includeBackground: true,
                fixedToCamera: true,
                itemsArr: [
                    {
                        type: "image",
                        content: "background-modal",
                        offsetY: -50,
                        contentScale: 1
                    },
                    {
                        type: "text",
                        content: "[t]",
                        fontFamily: "Press Start 2P",
                        fontSize: 21,
                        color: "0x000000",
                        offsetY: -225
                    },
                    {
                        type: "text",
                        content: this.status,
                        fontFamily: "Press Start 2P",
                        fontSize: 18,
                        color: "0x000000",
                        offsetY: -150
                    },
                    {
                        type: "button",
                        atlasParent: "small-button",
                        content: "background-button",
                        buttonHover: "background-button-hover",
                        offsetY: -60,
                        contentScale: 0.7,
                        callback: function () {
                            this.game.state.start('mainsolooffline', true, false, {
                                players: this.state.players,
                                map: this.state.mapClass
                            }, null);
                        }
                    },
                    {
                        type: "text",
                        content: "Replay",
                        fontFamily: "Press Start 2P",
                        fontSize: 18,
                        color: "0x000000",
                        offsetY: -60
                    },
                    {
                        type: "button",
                        atlasParent: "small-button",
                        content: "background-button",
                        buttonHover: "background-button-hover",
                        offsetY: 20,
                        contentScale: 0.7,
                        callback: function () {
                            this.game.state.start('menu');
                        }
                    },
                    {
                        type: "text",
                        content: "Quit",
                        fontFamily: "Press Start 2P",
                        fontSize: 18,
                        color: "0x000000",
                        offsetY: 20
                    },
                ]
            });
            this.uiManager.dialogUI.showModal('battleOver');
        }
    }
}
