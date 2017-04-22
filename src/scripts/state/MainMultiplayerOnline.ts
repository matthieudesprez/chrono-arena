declare var EasyStar;
module TacticArena.State {
    export class MainMultiplayerOnline extends TacticArena.State.BaseState {
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
        aiManager: Controller.AiManager;
        logManager: Controller.LogManager;
        signalManager: Controller.SignalManager;
        serverManager: Controller.ServerManager;
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

        init(data, serverManager, chatUI) {
            super.init();
            console.log(data);
            this.playMode = 'online';
            this.game.stage.backgroundColor = 0xffffff;
            var self = this;
            this.process = true;
            this.selecting = false;
            this.tileSize = 32;
            this.isPaused = false;
            this.hideProjections = false;
            this.teamColors = ['0x8ad886', '0xd68686', '0x87bfdb', '0xcdd385'];
            this.teams = {};
            this.serializer = new TS.Serializer(TacticArena);

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
            this.chatUI = chatUI;
            this.serverManager = serverManager;
            this.serverManager.game = this;
            this.players = data.content.players;
            let startPositions = [[{x: 8, y: 8, d: 'E'}, {x: 7, y: 7, d: 'E'}], [{x: 11, y: 8, d: 'W'}, {x: 12, y: 7, d: 'W'}]];
            this.players.forEach( (p, k) => {
                if (p.token == self.serverManager.token) {
                    this.playerTeam = k;
                }
                if (p.faction == 'human') {
                    this.pawns.push(new Entity.Pawn(this, startPositions[k][0].x, startPositions[k][0].y, startPositions[k][0].d, 'redhead', this.getUniqueId(), false, k, this.generator.generate()));
                    this.pawns.push(new Entity.Pawn(this, startPositions[k][1].x, startPositions[k][1].y, startPositions[k][1].d, 'blondy', this.getUniqueId(), false, k, this.generator.generate()));
                } else {
                    this.pawns.push(new Entity.Pawn(this, startPositions[k][0].x, startPositions[k][0].y, startPositions[k][0].d, 'evil', this.getUniqueId(), false, k, this.generator.generate()));
                    this.pawns.push(new Entity.Pawn(this, startPositions[k][1].x, startPositions[k][1].y, startPositions[k][1].d, 'skeleton', this.getUniqueId(), false, k, this.generator.generate()));
                }
            });
        }

        create() {
            let self = this;
            this.stageManager.addDecorations();

            this.pathfinder = new EasyStar.js();
            this.pathfinder.setAcceptableTiles([-1]);
            this.pathfinder.disableDiagonals();
            this.pathfinder.disableSync();
            this.pathfinder.setGrid(this.stageManager.grid);

            this.logManager = new Controller.LogManager(this);
            this.orderManager = new Controller.OrderManager(this);
            this.resolveManager = new Controller.ResolveManager(this);
            //this.aiManager = new Controller.AiManager(this);
            this.turnManager = new Controller.TurnManager(this);
            this.uiManager = new UI.UIManager(this);
            this.chatUI.menu = this.uiManager;

            let playerPawns = this.pawns.filter( pawn => { return pawn.team == self.playerTeam; });
            this.uiManager.initOrderPhase(playerPawns[0], true);
        }

        update() {
            this.pathTilesGroup.sort('y', Phaser.Group.SORT_ASCENDING);
            this.pawnsSpritesGroup.sort('y', Phaser.Group.SORT_ASCENDING);
            this.world.bringToTop(this.pointer.marker);
            this.world.bringToTop(this.pawnsSpritesGroup);
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
            let everyoneElseIsDead = true;
            this.pawns.forEach( pawn => {
                this.teams[pawn.team] = this.teams[pawn.team] || pawn.isAlive();
                if(pawn.team != this.playerTeam) {
                    everyoneElseIsDead = everyoneElseIsDead && !this.teams[pawn.team];
                }
            });
            console.log(this.teams, !this.teams[this.playerTeam], everyoneElseIsDead);
            return (!this.teams[this.playerTeam] || everyoneElseIsDead);
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
    }
}
