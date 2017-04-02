declare var EasyStar;
module TacticArena.State {
    export class Test extends TacticArena.State.BaseState {
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
        signalManager: Controller.SignalManager;
        uiManager: UI.UIManager;
        process: Boolean;
        selecting: Boolean;
        pointer;
        isPaused: Boolean;

        init() {

        }

        preload() {
            this.load.tilemap('map', 'assets/json/map.json', null, Phaser.Tilemap.TILED_JSON);
            this.load.image('tiles-collection', 'assets/images/maptiles.png');
            this.load.atlasJSONArray('skeleton', 'assets/images/skeleton.png', 'assets/images/skeleton.json');
            this.load.atlasJSONArray('fireball', 'assets/images/fireball.png', 'assets/images/fireball.json');
        }

        create() {
            this.process = true;
            this.selecting = false;
            this.tileSize = 32;
            this.isPaused = false;

            this.stageManager = new Controller.StageManager(this);
            this.stageManager.init();

            this.pawns = [];
            this.pathTilesGroup = this.add.group();
            this.pawnsSpritesGroup = this.add.group();

            this.stageManager.addDecorations();

            this.pathfinder = new EasyStar.js();
            this.pathfinder.setAcceptableTiles([-1]);
            this.pathfinder.disableDiagonals();
            this.pathfinder.disableSync();
            this.pathfinder.setGrid(this.stageManager.grid);

            this.signalManager = new Controller.SignalManager(this);
            this.logManager = new Controller.LogManager(this);
            this.orderManager = new Controller.OrderManager(this);
            this.resolveManager = new Controller.ResolveManager(this);
            this.aiManager = new Controller.AiManager(this);
            this.turnManager = new Controller.TurnManager(this);
        }
    }
}
