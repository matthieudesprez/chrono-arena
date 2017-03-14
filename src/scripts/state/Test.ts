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
            //this.load.image('preload-bar', '../../assets/images/character.png');
        }

        create() {
            console.log('test create');
            var self = this;
            this.process = true;
            this.selecting = false;
            this.tileSize = 32;
            this.isPaused = false;

            this.stageManager = new Controller.StageManager(this);

            let grid = [];
            for (var i = 0; i < 20; i++) {
                grid[i] = [];
                for (var j = 0; j < 20; j++) {
                    grid[i][j] = 0;
                }
            }
            this.stageManager.grid = grid;

            this.pathfinder = new EasyStar.js();
            this.pathfinder.setAcceptableTiles([-1]);
            this.pathfinder.disableDiagonals();
            this.pathfinder.disableSync();
            this.pathfinder.setGrid(this.stageManager.grid);

            //this.logManager = new Controller.LogManager(this);
            this.orderManager = new Controller.OrderManager(this);
            //this.resolveManager = new Controller.ResolveManager(this);
            //this.aiManager = new Controller.AiManager(this);
            this.turnManager = new Controller.TurnManager(this);
            //this.uiManager = new UI.UIManager(this);

            //this.onApChange = new Phaser.Signal();
            //this.onHpChange = new Phaser.Signal();
            //this.onOrderChange = new Phaser.Signal();
            //this.onActionPlayed = new Phaser.Signal();
            //this.turnInitialized = new Phaser.Signal();
            //this.stepResolutionFinished = new Phaser.Signal();
            //this.resolvePhaseFinished = new Phaser.Signal();
            //this.onApChange.add(function() {
            //    self.uiManager.pawnsinfosUI.updateInfos();
            //});
            //this.onHpChange.add(function() {
            //    self.uiManager.pawnsinfosUI.updateInfos();
            //});
            //this.onOrderChange.add(function(pawn) {
            //    self.uiManager.pawnsinfosUI.updateOrders(pawn, self.orderManager.orders);
            //});
            //this.onActionPlayed.add(function(pawn) {
            //    self.pointer.update();
            //});
            //this.turnInitialized.add(function(pawn) {
            //    self.process = false;
            //    if(pawn.isBot) {
            //        self.aiManager.play(pawn);
            //    } else {
            //        self.selecting = true;
            //    }
            //});
            //this.stepResolutionFinished.add(function(stepIndex) {
            //    self.uiManager.process = false;
            //    self.uiManager.notificationsUI.update(stepIndex);
            //});
            //this.resolvePhaseFinished.add(function() {
            //    self.isGameReadyPromise().then((res) => {
            //        self.uiManager.endResolvePhase();
            //    });
            //});

            //self.uiManager.initOrderPhase(this.pawns[0], true);
        }

        update() {

        }

        //isGameReadyPromise() {
        //    var self = this;
        //    return new Promise((resolve, reject) => {
        //        (function isGameReady(){
        //            if (!self.isPaused) return resolve();
        //            setTimeout(isGameReady, 300);
        //        })();
        //    });
        //}
    }
}
