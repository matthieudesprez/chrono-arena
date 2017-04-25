/// <reference path="BaseState.ts"/>
module TacticArena.State {
    export class BaseBattle extends TacticArena.State.BaseState {
        layer: Phaser.TilemapLayer;
        pawns: Entity.Pawn[];
        pathTilesGroup;
        pathOrdersTilesGroup;
        pawnsSpritesGroup;
        uiSpritesGroup;
        pathfinder;
        tileSize: number;
        turnManager: Controller.TurnManager;
        orderManager: Controller.OrderManager;
        resolveManager: Controller.ResolveManager;
        stageManager: Controller.StageManager;
        logManager: Controller.LogManager;
        signalManager: Controller.SignalManager;
        uiManager: UI.UIManager;
        process: Boolean;
        selecting: Boolean;
        pointer;
        isPaused: Boolean;
        hideProjections: Boolean;
        teamColors;
        playerTeam;
        teams;
        players;
        chatUI;
        generator;
        playMode;
        serializer;

        constructor() {
            super();
        }

        init(data?, chat?, server?) {
            super.init();
            this.game.stage.backgroundColor = 0xffffff;
            this.process = true;
            this.selecting = false;
            this.tileSize = 32;
            this.isPaused = false;
            this.hideProjections = false;
            this.teamColors = ['0x8ad886', '0xd68686', '0x87bfdb', '0xcdd385'];
            this.teams = {};
            //this.serializer = new TS.Serializer(TacticArena);
            this.signalManager = new Controller.SignalManager(this);
            this.signalManager.init();

            this.stageManager = new Controller.StageManager(this);
            this.stageManager.init();

            this.pointer = new UI.Pointer(this);

            this.pawns = [];
            this.pathTilesGroup = this.add.group();
            this.pathOrdersTilesGroup = this.add.group();
            this.uiSpritesGroup = this.add.group();
            this.pawnsSpritesGroup = this.add.group();

            this.generator = new Utils.Generator();
        }

        create() {
            let self = this;
            this.stageManager.addDecorations();
            console.log('decorations');

            this.pathfinder = new EasyStar.js();
            this.pathfinder.setAcceptableTiles([-1]);
            this.pathfinder.disableDiagonals();
            this.pathfinder.disableSync();
            this.pathfinder.setGrid(this.stageManager.grid);

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

        update() {
            this.pathTilesGroup.sort('y', Phaser.Group.SORT_ASCENDING);
            this.pawnsSpritesGroup.sort('y', Phaser.Group.SORT_ASCENDING);
            this.world.bringToTop(this.pointer.marker);
            //this.world.bringToTop(this.pawnsSpritesGroup);
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
                for(var i=0; i < this.pawns.length; i++) {
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
