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
        pointer;
        isPaused: boolean;
        players;
        generator;
        mapName;
        mapClass;
        map: Map.BaseMap;

        init(data?) {
            super.init();
            this.process = true;
            this.isPaused = false;

            this.spritesManager = new SpritesManager(this);

            this.mapClass = data.map;
            this.map = new this.mapClass();
            this.game.stage.backgroundColor = this.map.backgroundColor;

            this.mapGroup = new Phaser.Group(this.game);
            this.worldGroup.add(this.mapGroup);

            this.pathTilesGroup = new Phaser.Group(this.game);
            this.worldGroup.add(this.pathTilesGroup);

            this.pathOrdersTilesGroup = new Phaser.Group(this.game);
            this.worldGroup.add(this.pathOrdersTilesGroup);

            this.uiSpritesGroup = new Phaser.Group(this.game);
            this.worldGroup.add(this.uiSpritesGroup);

            this.pawnsSpritesGroup = new Phaser.Group(this.game);
            this.worldGroup.add(this.pawnsSpritesGroup);

            this.mapDecorationGroup = new Phaser.Group(this.game);
            this.worldGroup.add(this.mapDecorationGroup);

            this.uiGroup = new Phaser.Group(this.game);
            this.worldGroup.add(this.uiGroup);

            this.pawns = [];

            this.generator = new Utils.Generator();

            this.initMap();
        }

        create() {
            this.addDecorations();
            this.pathfinder = new EasyStar.js();
            this.pathfinder.setAcceptableTiles([-1]);
            this.pathfinder.disableDiagonals();
            this.pathfinder.setGrid(this.stageManager.grid);
        }

        update() {
            this.spritesManager.update();
            //this.pathTilesGroup.sort('y', Phaser.Group.SORT_ASCENDING);
            //this.uiSpritesGroup.sort('y', Phaser.Group.SORT_ASCENDING);
            this.pawnsSpritesGroup.sort('y', Phaser.Group.SORT_ASCENDING);
            //this.pawnsSpritesGroup.children.sort((a, b) => {
            //    console.log(a, b);
            //    if (a.scale.x < b.scale.x) {
            //        return -1;
            //    } else {
            //        return 1;
            //    }
            //});

        }

        initMap() {
            this.stageManager = new StageManager(this);
            this.stageManager.init(this.map);
        }

        addDecorations() {
            this.stageManager.addDecorations();
        }

        shutdown() {
            if (this.pointer) {
                this.pointer.destroy();
            }
            this.pointer = null;
        }

        getChampion(id): Champion.BaseChampion {
            return this.pawns.find((champion: Champion.BaseChampion) => {
                return champion._id === id;
            });
        }
    }
}
