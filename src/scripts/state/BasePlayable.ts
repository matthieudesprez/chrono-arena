/// <reference path="BaseState.ts"/>
module TacticArena.State {
    export class BasePlayable extends TacticArena.State.BaseState {
        pawns: Champion.BaseChampion[];
        spritesManager: SpritesManager;
        mapGroup: Phaser.Group;
        mapDecorationGroup: Phaser.Group;
        pathTilesGroup: Phaser.Group;
        pathOrdersTilesGroup: Phaser.Group;
        pawnsSpritesGroup: Phaser.Group;
        uiSpritesGroup: Phaser.Group;
        uiGroup: Phaser.Group;
        pathfinder;
        stageManager: StageManager;
        process: boolean;
        modalVisible: boolean;
        pointer;
        isPaused: boolean;
        players;
        generator;
        mapName;
        mapClass;
        map: Map.BaseMap;

        constructor() {
            super();
        }

        init(data?) {
            super.init();
            this.process = true;
            this.modalVisible = false;
            this.isPaused = false;

            this.spritesManager = new SpritesManager(this);

            this.mapClass = data.map;
            this.map = new data.map();
            this.game.stage.backgroundColor = this.map.backgroundColor;

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
            this.spritesManager.update();
            //this.pathTilesGroup.sort('y', Phaser.Group.SORT_ASCENDING);
            //this.uiSpritesGroup.sort('y', Phaser.Group.SORT_ASCENDING);
            this.pawnsSpritesGroup.sort('y', Phaser.Group.SORT_ASCENDING);
        }

        initMap() {
            this.stageManager = new StageManager(this);
            this.stageManager.init(this.map);
        }

        addDecorations() {
            this.stageManager.addDecorations();
        }

        shutdown () {
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
            //delete this.stageManager;
            //delete this.process;
            //delete this.isPaused;
            //delete this.players;
            //delete this.generator;
            //delete this.mapName;
        }
    }
}
