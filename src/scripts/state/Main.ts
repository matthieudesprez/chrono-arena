declare var EasyStar;
/// <reference path="../definitions/jquery.d.ts" />
/// <reference path="../definitions/easystarjs.d.ts"/>
module TacticArena.State {
    export class Main extends Phaser.State {
        layer: Phaser.TilemapLayer;
        pawns: Entity.Pawn[];
        pawnsSpritesGroup;
        pathfinder;
        tileSize: number;
        turnManager: Controller.TurnManager;
        orderManager: Controller.OrderManager;
        stageManager: Controller.StageManager;
        uiManager: UI.UIManager;
        process: Boolean;
        pointer;
        onApChange:Phaser.Signal;
        onHpChange:Phaser.Signal;
        onOrderAdd:Phaser.Signal;
        onActionPlayed:Phaser.Signal;

        create() {
            var that = this;
            this.process = true;
            this.tileSize = 32;

            this.stageManager = new Controller.StageManager(this);
            this.stageManager.init();

            this.pointer = new UI.Pointer(this);

            this.pawns = [];
            this.pawnsSpritesGroup = this.add.group();
            this.pawns.push(new Entity.Pawn(this, 7, 9, 'E', 'redhead', this.getUniqueId()));
            this.pawns.push(new Entity.Pawn(this, 12, 9, 'W', 'skeleton', this.getUniqueId()));

            this.stageManager.addDecorations();

            this.pathfinder = new EasyStar.js();
            this.pathfinder.setAcceptableTiles([-1]);
            this.pathfinder.disableDiagonals();
            this.pathfinder.disableSync();
            this.pathfinder.setGrid(this.stageManager.grid);

            this.orderManager = new Controller.OrderManager(this);
            this.turnManager = new Controller.TurnManager(this);
            this.uiManager = new UI.UIManager(this);

            this.onApChange = new Phaser.Signal();
            this.onHpChange = new Phaser.Signal();
            this.onOrderAdd = new Phaser.Signal();
            this.onActionPlayed = new Phaser.Signal();
            this.onApChange.add(function() {
                that.uiManager.pawnsinfosUI.updateInfos();
            });
            this.onHpChange.add(function() {
                that.uiManager.pawnsinfosUI.updateInfos();
            });
            this.onOrderAdd.add(function(pawn) {
                console.log('orderadd');
            });
            this.onActionPlayed.add(function(pawn) {
                that.stageManager.showPossibleMove(pawn.getProjectionOrReal().getPosition(), pawn.getReal().getAp());
            });

            this.turnManager.initTurn(this.pawns[0], true).then((res) => {
                this.process = false;
                console.log(that.turnManager.getActivePawn());
                that.uiManager.init();
            });
        }

        update() {
            this.pawnsSpritesGroup.sort('y', Phaser.Group.SORT_ASCENDING);
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
