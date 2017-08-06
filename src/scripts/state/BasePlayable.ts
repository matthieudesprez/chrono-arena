/// <reference path="BaseState.ts"/>
module TacticArena.State {
    export class BasePlayable extends TacticArena.State.BaseState {
        pawns: Entity.Pawn[];
        worldGroup: Phaser.Group;
        mapGroup: Phaser.Group;
        pathTilesGroup: Phaser.Group;
        pathOrdersTilesGroup: Phaser.Group;
        pawnsSpritesGroup: Phaser.Group;
        uiSpritesGroup: Phaser.Group;
        uiGroup: Phaser.Group;
        pathfinder;
        tileSize: number;
        stageManager: StageManager;
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
            this.game.stage.backgroundColor = 0x000000;
            this.process = true;
            this.modalVisible = false;
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

            this.uiGroup = this.add.group();
            this.worldGroup.add(this.uiGroup);

            this.worldGroup.scale.set(this.getScaleRatio());
            console.log(this.getScaleRatio());

            this.pawns = [];

            this.generator = new Utils.Generator();

            this.initMap();
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
            this.stageManager = new StageManager(this);
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
