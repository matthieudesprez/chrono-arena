module TacticArena.Controller {
    export class StageManager {
        game;
        map:Phaser.Tilemap;
        layer;
        grid;

        constructor(game) {
        	this.game = game;
        	this.map = null;
        	this.layer = null;
        	this.grid = [];
            
        }

        init() {
            this.map = this.game.add.tilemap('map');
            this.map.addTilesetImage('tiles-collection');
            this.map.createLayer('Background');
            this.layer = this.map.createLayer('Foreground');
            this.map.createLayer('Decorations');
            this.map.createLayer('Decorations2');

            for(var i = 0; i < this.map.layers[1].data.length; i++) {
                this.grid[i] = [];
                for(var j = 0; j < this.map.layers[1].data[i].length; j++) {
                    this.grid[i][j] = this.map.layers[1].data[i][j].index;
                }
            }
        }

        addDecorations() {
            this.map.createLayer('Decorations3');
        }

        canMove(x, y) {
            if(this.grid[y]) {
                return this.grid[y][x];
            }
            return false;
        }

        getNbTilesBetween(coordsA, coordsB) {
            return Math.abs(coordsA.x - coordsB.x) + Math.abs(coordsA.y - coordsB.y);
        }
    }
}
