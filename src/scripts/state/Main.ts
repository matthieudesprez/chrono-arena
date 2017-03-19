declare var EasyStar;
module TacticArena.State {
    export class Main extends Phaser.State {
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
            this.pawns.push(new Entity.Pawn(this, 8, 8, 'E', 'redhead', this.getUniqueId(), false, 'Eikio'));
            this.pawns.push(new Entity.Pawn(this, 10, 8, 'W', 'skeleton', this.getUniqueId(), false, 'Dormammu'));

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
            this.uiManager = new UI.UIManager(this);

            this.onApChange = new Phaser.Signal();
            this.onHpChange = new Phaser.Signal();
            this.onOrderChange = new Phaser.Signal();
            this.onActionPlayed = new Phaser.Signal();
            this.turnInitialized = new Phaser.Signal();
            this.stepResolutionFinished = new Phaser.Signal();
            this.resolvePhaseFinished = new Phaser.Signal();
            this.onApChange.add(function() {
                self.uiManager.pawnsinfosUI.updateInfos();
            });
            this.onHpChange.add(function() {
                self.uiManager.pawnsinfosUI.updateInfos();
            });
            this.onOrderChange.add(function(pawn) {
                self.uiManager.pawnsinfosUI.updateOrders(pawn, self.orderManager.orders);
            });
            this.onActionPlayed.add(function(pawn) {
                self.pointer.update();
            });
            this.turnInitialized.add(function(pawn) {
                self.process = false;
                if(pawn.isBot) {
                    self.aiManager.play(pawn);
                } else {
                    self.selecting = true;
                }
            });
            this.stepResolutionFinished.add(function(stepIndex) {
                self.uiManager.process = false;
                self.uiManager.notificationsUI.update(stepIndex);
            });
            this.resolvePhaseFinished.add(function() {
                self.isGameReadyPromise().then((res) => {
                    self.uiManager.endResolvePhase();
                });
            });

            self.uiManager.initOrderPhase(this.pawns[0], true);
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
