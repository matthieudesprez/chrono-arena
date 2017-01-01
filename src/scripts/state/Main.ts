declare var EasyStar;
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
        uiManager: UI.UIManager
        process: Boolean;
        pointer;

        create() {
            this.process = true;
            this.tileSize = 32;

            this.stageManager = new Controller.StageManager(this);
            this.stageManager.init();

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

            this.pointer = new UI.Pointer(this);

            this.orderManager = new Controller.OrderManager(this);

            this.turnManager = new Controller.TurnManager(this);
            this.turnManager.initTurn(this.pawns[0]).then((res) => {
                this.process = false;
            });

            this.uiManager = new UI.UIManager(this);
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
