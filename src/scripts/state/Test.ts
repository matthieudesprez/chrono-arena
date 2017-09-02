declare var EasyStar;
module TacticArena.State {
    export class Test extends TacticArena.State.BaseState {
        layer: Phaser.TilemapLayer;
        pawns: Entity.Pawn[];
        pathfinder;
        tileSize: number;

        worldGroup: Phaser.Group;
        mapGroup: Phaser.Group;
        mapDecorationGroup: Phaser.Group;
        pathTilesGroup: Phaser.Group;
        pathOrdersTilesGroup: Phaser.Group;
        pawnsSpritesGroup: Phaser.Group;
        uiSpritesGroup: Phaser.Group;
        uiGroup: Phaser.Group;

        turnManager: TurnManager;
        orderManager: OrderManager;
        resolveManager: ResolveManager;
        stageManager: StageManager;
        logManager: LogManager;
        signalManager: SignalManager;
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
            this.worldGroup = this.add.group();

            this.mapGroup = this.add.group();
            this.worldGroup.add(this.mapGroup);

            this.pathTilesGroup = this.add.group();
            this.worldGroup.add(this.pathTilesGroup);

            this.pathOrdersTilesGroup = this.add.group();
            this.worldGroup.add(this.pathOrdersTilesGroup);

            this.uiSpritesGroup = this.add.group();
            this.worldGroup.add(this.uiSpritesGroup);

            this.pawnsSpritesGroup = this.add.group();
            this.worldGroup.add(this.pawnsSpritesGroup);

            this.mapDecorationGroup = this.add.group();
            this.worldGroup.add(this.mapDecorationGroup);

            this.uiGroup = this.add.group();
            this.worldGroup.add(this.uiGroup);

            this.stageManager = new StageManager(this);
            this.stageManager.init('map');

            this.pawns = [];
            this.pathTilesGroup = this.add.group();
            this.pawnsSpritesGroup = this.add.group();

            this.stageManager.addDecorations();

            this.pathfinder = new EasyStar.js();
            this.pathfinder.setAcceptableTiles([-1]);
            this.pathfinder.disableDiagonals();
            this.pathfinder.disableSync();
            this.pathfinder.setGrid(this.stageManager.grid);

            this.signalManager = new SignalManager(this);
            this.logManager = new LogManager(this);
            this.orderManager = new OrderManager(this);
            this.resolveManager = new ResolveManager(this);
            this.turnManager = new TurnManager(this);
        }
    }
}
