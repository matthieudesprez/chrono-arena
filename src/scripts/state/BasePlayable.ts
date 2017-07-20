/// <reference path="BaseState.ts"/>
module TacticArena.State {
    export class BasePlayable extends TacticArena.State.BaseState {
        pawns: Entity.Pawn[];
        pathTilesGroup;
        pathOrdersTilesGroup;
        pawnsSpritesGroup;
        uiSpritesGroup;
        pathfinder;
        tileSize: number;
        stageManager: Controller.StageManager;
        process: Boolean;
        modalVisible: Boolean;
        pointer;
        isPaused: Boolean;
        players;
        generator;
        mapName;

        constructor() {
            super();
        }

        init(data?) {
            super.init();
            this.game.stage.backgroundColor = 0xffffff;
            this.process = true;
            this.modalVisible = false;
            this.tileSize = 32;
            this.isPaused = false;

            this.initMap();

            this.pawns = [];
            this.pathTilesGroup = this.add.group();
            this.pathOrdersTilesGroup = this.add.group();
            this.uiSpritesGroup = this.add.group();
            this.pawnsSpritesGroup = this.add.group();

            this.generator = new Utils.Generator();
        }

        create() {
            this.addDecorations();

            this.pathfinder = null;
            this.pathfinder = new EasyStar.js();
            this.pathfinder.setAcceptableTiles([-1]);
            this.pathfinder.disableDiagonals();
            //this.pathfinder.enableDiagonals();
            //this.pathfinder.disableSync();
            this.pathfinder.setGrid(this.stageManager.grid);
        }

        update() {
            this.pathTilesGroup.sort('y', Phaser.Group.SORT_ASCENDING);
            this.uiSpritesGroup.sort('y', Phaser.Group.SORT_ASCENDING);
            this.pawnsSpritesGroup.sort('y', Phaser.Group.SORT_ASCENDING);
        }

        initMap() {
            this.stageManager = new Controller.StageManager(this);
            this.stageManager.init(this.mapName);
        }

        addDecorations() {
            this.stageManager.addDecorations();
        }

        shutdown () {
            console.log('switch');
            if(this.pointer) {
                this.pointer.destroy();
            }
            this.pointer = null;
            //delete this.pathfinder;
            //delete this.pawns;
            //delete this.pathTilesGroup;
            //delete this.pathOrdersTilesGroup;
            //delete this.pawnsSpritesGroup;
            //delete this.uiSpritesGroup;
            //delete this.tileSize;
            //delete this.stageManager;
            //delete this.process;
            //delete this.isPaused;
            //delete this.players;
            //delete this.generator;
            //delete this.mapName;
        }
    }
}
