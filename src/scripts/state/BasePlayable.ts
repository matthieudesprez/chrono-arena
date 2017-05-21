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
        pointer;
        isPaused: Boolean;
        players;
        generator;
        mapName;

        constructor() {
            super();
        }

        init() {
            super.init();
            this.game.stage.backgroundColor = 0xffffff;
            this.process = true;
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
    }
}
