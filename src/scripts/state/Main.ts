declare var EasyStar;
/// <reference path="../definitions/easystarjs.d.ts"/>
module TypescriptPhaser.State {
    export class Main extends Phaser.State {
        map:Phaser.Tilemap;
        layer:Phaser.TilemapLayer;
        marker:Phaser.Graphics;
        players;
        pathfinder;
        grid;
        tileSize:number;
        playerScript;
        tickTimer;
        turnManager;
        processing;
        endTurnKey;
        orderManager;

        create() {
            this.processing = true;
            this.tileSize = 32;
            this.map = this.add.tilemap('map');
            this.map.addTilesetImage('tiles-collection');
            this.map.createLayer('Background');
            this.layer = this.map.createLayer('Foreground');
            this.map.createLayer('Decorations');
            this.map.createLayer('Decorations2');

            this.players = [];            
            this.players.push(new Entity.Player(this, 3, 9, 'E'));
            this.players.push(new Entity.Player(this, 12, 9, 'W'));

            this.map.createLayer('Decorations3');

            this.marker = this.add.graphics(0,0);
            this.marker.lineStyle(2, 0xffffff, 1);
            this.marker.drawRect(0, 0, this.tileSize, this.tileSize);
            this.input.addMoveCallback(this.updateMarker, this);
            this.input.onDown.add(this.onGridClick, this);

            this.pathfinder = new EasyStar.js();
            this.pathfinder.setAcceptableTiles([-1]);
            this.pathfinder.disableDiagonals();
            this.pathfinder.disableSync();

            this.grid = [];
            for(var i = 0; i < this.map.layers[1].data.length; i++) {
                this.grid[i] = [];
                for(var j = 0; j < this.map.layers[1].data[i].length; j++) {
                    this.grid[i][j] = this.map.layers[1].data[i][j].index;
                }
            }
            this.pathfinder.setGrid(this.grid);

            this.endTurnKey = this.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR);
            this.endTurnKey.onDown.add(this.endTurn ,this);

            this.orderManager = new Controller.OrderManager(this);

            this.turnManager = new Controller.TurnManager(this);
            this.turnManager.initTurn(this.players[0]).then((res) => {
                this.processing = false;
            });
        }

        update() {

        }

        endTurn() {
            if (!this.processing) {
                this.processing = true;
                this.orderManager.resolveAll().then((res) => {
                    this.turnManager.endTurn().then((res) => {
                        this.turnManager.initTurn(this.players[res]);
                        this.processing = false;
                    });
                });
            }
        }

        updateMarker() {
            this.marker.x = this.layer.getTileX(this.input.activePointer.worldX) * this.tileSize;
            this.marker.y = this.layer.getTileY(this.input.activePointer.worldY) * this.tileSize;
        }

        canMove(x, y) {
            if(this.grid[y]) {
                return this.grid[y][x];
            }
            return false;
        }

        onGridClick() {
            var activePlayer = this.turnManager.getActivePlayer();
            activePlayer.ghost = new Entity.Player(
                this,
                activePlayer.getPosition().x,
                activePlayer.getPosition().y,
                activePlayer.ext
            );
            activePlayer.ghost.sprite.alpha = 0.5;
            var targetX = this.marker.x / this.tileSize;
            var targetY = this.marker.y / this.tileSize;
            activePlayer.preMoveTo(targetX, targetY);
            this.orderManager.add('move', activePlayer, targetX, targetY);
        }
    }
}
