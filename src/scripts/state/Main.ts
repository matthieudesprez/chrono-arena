declare var EasyStar;
module TacticArena.State {
    export class Main extends TacticArena.State.BaseState {
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
        uiManager: UI.UIManager;
        process: Boolean;
        selecting: Boolean;
        pointer;
        isPaused: Boolean;
        hideProjections: Boolean;

        create() {
            var self = this;
            this.process = true;
            this.selecting = false;
            this.tileSize = 32;
            this.isPaused = false;
            this.hideProjections = false;

            this.stageManager = new Controller.StageManager(this);
            this.stageManager.init();

            this.pointer = new UI.Pointer(this);

            this.pawns = [];
            this.pathTilesGroup = this.add.group();
            this.pathOrdersTilesGroup = this.add.group();
            this.uiSpritesGroup = this.add.group();
            this.pawnsSpritesGroup = this.add.group();
            this.pawns.push(new Entity.Pawn(this, 8, 8, 'E', 'redhead', this.getUniqueId(), false, 1, 'Eikio'));
            this.pawns.push(new Entity.Pawn(this, 7, 7, 'E', 'blondy', this.getUniqueId(), false, 1, 'Diana'));
            this.pawns.push(new Entity.Pawn(this, 11, 8, 'W', 'skeleton', this.getUniqueId(), false, 2, 'Fétide'));
            this.pawns.push(new Entity.Pawn(this, 12, 7, 'W', 'skeleton', this.getUniqueId(), false, 2, 'Oscar'));

            this.stageManager.addDecorations();

            this.pathfinder = new EasyStar.js();
            this.pathfinder.setAcceptableTiles([-1]);
            this.pathfinder.disableDiagonals();
            this.pathfinder.disableSync();
            this.pathfinder.setGrid(this.stageManager.grid);

            this.signalManager = new Controller.SignalManager(this);
            this.signalManager.init();
            this.logManager = new Controller.LogManager(this);
            this.orderManager = new Controller.OrderManager(this);
            this.resolveManager = new Controller.ResolveManager(this);
            this.aiManager = new Controller.AiManager(this);
            this.turnManager = new Controller.TurnManager(this);
            this.uiManager = new UI.UIManager(this);

            self.uiManager.initOrderPhase(this.pawns[0], true);

            this.pawns[2].setHp(0);
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
