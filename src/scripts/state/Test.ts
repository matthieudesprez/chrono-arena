declare var EasyStar;
module TacticArena.State {
    export class Test extends TacticArena.State.BaseState {
        layer: Phaser.TilemapLayer;
        pawns: Champion.BaseChampion[];
        spritesManager: SpritesManager;
        pathfinder;
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
        process: boolean;
        selecting: boolean;
        pointer;
        isPaused: boolean;
        map;

        init() {

        }

        preload() {
            this.load.tilemap('arena', 'assets/maps/arena.json', null, Phaser.Tilemap.TILED_JSON);
            this.load.image('tiles-collection', 'assets/images/maptiles.png'); //
            this.load.atlasJSONArray('skeleton', 'assets/images/characters/skeleton/spritesheet.png', 'assets/images/characters/skeleton/spritesheet.json');
            this.load.atlasJSONArray('fireball', 'assets/images/fireball.png', 'assets/images/fireball.json');
        }

        create() {
            this.process = true;
            this.selecting = false;
            this.isPaused = false;
            this.spritesManager = new SpritesManager(this);
            this.worldGroup = new Phaser.Group(this.game);

            this.mapGroup = new Phaser.Group(this.game);
            this.worldGroup.add(this.mapGroup);

            this.pathTilesGroup = new Phaser.Group(this.game);
            this.worldGroup.add(this.pathTilesGroup);

            this.pathOrdersTilesGroup = new Phaser.Group(this.game);
            this.worldGroup.add(this.pathOrdersTilesGroup);

            this.uiSpritesGroup = new Phaser.Group(this.game);
            this.worldGroup.add(this.uiSpritesGroup);

            this.pawnsSpritesGroup = new Phaser.Group(this.game);
            this.worldGroup.add(this.pawnsSpritesGroup);

            this.mapDecorationGroup = new Phaser.Group(this.game);
            this.worldGroup.add(this.mapDecorationGroup);

            this.uiGroup = new Phaser.Group(this.game);
            this.worldGroup.add(this.uiGroup);

            this.map = new Map.Test();
            this.stageManager = new StageManager(this);
            this.stageManager.init(this.map);

            this.pawns = [];
            this.pathTilesGroup = new Phaser.Group(this.game);
            this.pawnsSpritesGroup = new Phaser.Group(this.game);

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
