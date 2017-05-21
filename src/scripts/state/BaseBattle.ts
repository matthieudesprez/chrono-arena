/// <reference path="BasePlayable.ts"/>
module TacticArena.State {
    export class BaseBattle extends TacticArena.State.BasePlayable {
        turnManager: Controller.TurnManager;
        orderManager: Controller.OrderManager;
        resolveManager: Controller.ResolveManager;
        logManager: Controller.LogManager;
        signalManager: Controller.SignalManager;
        uiManager: UI.UIManager;
        selecting: Boolean;
        hideProjections: Boolean;
        teamColors;
        playerTeam;
        teams;
        chatUI;
        playMode;

        constructor() {
            super();
        }

        init(data?, chat?, server?) {
            super.init();
            this.selecting = false;
            this.hideProjections = false;
            this.teamColors = ['0x8ad886', '0xd68686', '0x87bfdb', '0xcdd385'];
            this.teams = {};
            //this.serializer = new TS.Serializer(TacticArena);
            this.signalManager = new Controller.SignalManager(this);
            this.signalManager.init();

            this.pointer = new UI.Pointer(this);
        }

        create() {
            super.create();
            let self = this;

            this.logManager = new Controller.LogManager(this);
            this.orderManager = new Controller.OrderManager(this);
            this.resolveManager = new Controller.ResolveManager(this);
            this.turnManager = new Controller.TurnManager(this);
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
            console.log(ennemyPawnAlive, allyPawnAlive);
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
    }
}
