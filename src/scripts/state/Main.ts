declare var EasyStar;
/// <reference path="../definitions/jquery.d.ts" />
/// <reference path="../definitions/easystarjs.d.ts"/>
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
        stageManager: Controller.StageManager;
        aiManager: Controller.AiManager;
        uiManager: UI.UIManager;
        process: Boolean;
        selecting: Boolean;
        pointer;
        onApChange:Phaser.Signal;
        onHpChange:Phaser.Signal;
        onOrderChange:Phaser.Signal;
        onActionPlayed:Phaser.Signal;
        turnInitialized:Phaser.Signal;

        create() {
            var that = this;
            this.process = true;
            this.selecting = false;
            this.tileSize = 32;

            this.stageManager = new Controller.StageManager(this);
            this.stageManager.init();

            this.pointer = new UI.Pointer(this);

            this.pawns = [];
            this.pathTilesGroup = this.add.group();
            this.pawnsSpritesGroup = this.add.group();
            this.pawns.push(new Entity.Pawn(this, 8, 8, 'E', 'redhead', this.getUniqueId(), false));
            this.pawns.push(new Entity.Pawn(this, 10, 8, 'W', 'skeleton', this.getUniqueId(), true));

            this.stageManager.addDecorations();

            this.pathfinder = new EasyStar.js();
            this.pathfinder.setAcceptableTiles([-1]);
            this.pathfinder.disableDiagonals();
            this.pathfinder.disableSync();
            this.pathfinder.setGrid(this.stageManager.grid);

            this.orderManager = new Controller.OrderManager(this);
            this.aiManager = new Controller.AiManager(this);
            this.turnManager = new Controller.TurnManager(this);
            this.uiManager = new UI.UIManager(this);

            this.onApChange = new Phaser.Signal();
            this.onHpChange = new Phaser.Signal();
            this.onOrderChange = new Phaser.Signal();
            this.onActionPlayed = new Phaser.Signal();
            this.turnInitialized = new Phaser.Signal();
            this.onApChange.add(function() {
                that.uiManager.pawnsinfosUI.updateInfos();
            });
            this.onHpChange.add(function() {
                that.uiManager.pawnsinfosUI.updateInfos();
            });
            this.onOrderChange.add(function(pawn) {
                that.uiManager.pawnsinfosUI.updateOrders(pawn, that.orderManager.orders);
            });
            this.onActionPlayed.add(function(pawn) {
                that.pointer.update();
            });
            this.turnInitialized.add(function(pawn) {
                that.process = false;
                if(pawn.bot) {
                    that.aiManager.play(pawn);
                } else {
                    that.selecting = true;
                }
            });

            this.turnManager.initTurn(this.pawns[0], true).then((res) => {
                that.uiManager.initTurn(this.pawns[0], true);
            });
        }

        update() {
            this.pathTilesGroup.sort('y', Phaser.Group.SORT_ASCENDING);
            this.pawnsSpritesGroup.sort('y', Phaser.Group.SORT_ASCENDING);
            this.world.bringToTop(this.pointer.marker);
            this.world.bringToTop(this.pawnsSpritesGroup);
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
