declare var EasyStar;
module TacticArena.State {
    export class Test extends Phaser.State {
        layer: Phaser.TilemapLayer;
        pawns: Entity.Pawn[];
        pathTilesGroup;
        pawnsSpritesGroup;
        pathfinder;
        tileSize: number;
        turnManager: Controller.TurnManager;
        orderManager: Controller.OrderManager;
        resolveManager: Controller.ResolveManager;
        stageManager: Controller.StageManager;
        aiManager: Controller.AiManager;
        logManager: Controller.LogManager;
        uiManager: UI.UIManager;
        process: Boolean;
        selecting: Boolean;
        pointer;
        onApChange:Phaser.Signal;
        onHpChange:Phaser.Signal;
        onOrderChange:Phaser.Signal;
        onActionPlayed:Phaser.Signal;
        turnInitialized:Phaser.Signal;
        stepResolutionFinished:Phaser.Signal;
        resolvePhaseFinished:Phaser.Signal;
        isPaused: Boolean;


        preload() {
            this.load.tilemap('map', 'assets/json/map.json', null, Phaser.Tilemap.TILED_JSON);
            this.load.image('tiles-collection', 'assets/images/maptiles.png');
            this.load.atlasJSONArray('skeleton', 'assets/images/skeleton.png', 'assets/images/skeleton.json');
        }

        create() {
            var self = this;
            this.process = true;
            this.selecting = false;
            this.tileSize = 32;
            this.isPaused = false;

            this.stageManager = new Controller.StageManager(this);
            this.stageManager.init();

            this.pointer = new UI.Pointer(this);

            this.pawns = [];
            this.pathTilesGroup = this.add.group();
            this.pawnsSpritesGroup = this.add.group();
            //this.pawns.push(new Entity.Pawn(this, 8, 8, 'E', 'skeleton', 1, false, 'Eikio'));
            //this.pawns.push(new Entity.Pawn(this, 10, 8, 'W', 'skeleton', 2, false, 'Dormammu'));

            this.stageManager.addDecorations();

            this.pathfinder = new EasyStar.js();
            this.pathfinder.setAcceptableTiles([-1]);
            this.pathfinder.disableDiagonals();
            this.pathfinder.disableSync();
            this.pathfinder.setGrid(this.stageManager.grid);

            this.logManager = new Controller.LogManager(this);
            this.orderManager = new Controller.OrderManager(this);
            this.resolveManager = new Controller.ResolveManager(this);
            this.aiManager = new Controller.AiManager(this);
            this.turnManager = new Controller.TurnManager(this);
            //this.uiManager = new UI.UIManager(this);

            this.onApChange = new Phaser.Signal();
            this.onHpChange = new Phaser.Signal();
            this.onOrderChange = new Phaser.Signal();
            this.onActionPlayed = new Phaser.Signal();
            this.turnInitialized = new Phaser.Signal();
            this.stepResolutionFinished = new Phaser.Signal();
            this.resolvePhaseFinished = new Phaser.Signal();

            //self.uiManager.initOrderPhase(this.pawns[0], true);
        }
    }
}
