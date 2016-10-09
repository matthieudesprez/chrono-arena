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

        create() {
            this.tileSize = 32;
            this.map = this.add.tilemap('map');
            this.map.addTilesetImage('tiles-collection');
            this.map.createLayer('Background'); //
            this.layer = this.map.createLayer('Foreground'); //
            this.players = [];
            this.map.createLayer('Decorations'); //
            this.map.createLayer('Decorations2'); //
            this.players.push(new Entity.Player(this, 7, 9, 'E'));
            this.players.push(new Entity.Player(this, 12, 9, 'W'));
            this.map.createLayer('Decorations3'); //
            this.marker = this.add.graphics(0,0);
            this.marker.lineStyle(2, 0xffffff, 1);
            this.marker.drawRect(0, 0, this.tileSize, this.tileSize);
            this.input.addMoveCallback(this.updateMarker, this);
            //console.log(this.map, this.layer);
            let me = this;
            //document.getElementById('reload').addEventListener('click', function() {
            //    me.reload(me);
            //});

            //this.players.push(new Entity.Player(this)); //ooooioipoi

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
            console.log(this.grid);
            this.pathfinder.setGrid(this.grid);
            //this.playerScript = document.getElementById('script').getAttribute('value');
            this.tickTimer = this.time.events.loop(1000, this.gameLoop, this);
        }

        gameLoop() {
            //console.log(this.canMove(this.player.getPosition().x / 32 + 1, this.player.getPosition().y / 32));
            //this.players[0].goRandom();
            //eval(this.playerScript);
        }

        update() {
           //console.log('u'); // //
        }

        updateMarker() {
            this.marker.x = this.layer.getTileX(this.input.activePointer.worldX) * this.tileSize;
            this.marker.y = this.layer.getTileY(this.input.activePointer.worldY) * this.tileSize;
        }

        canMove(x, y) {
            if(this.grid[y]) {
                console.log(x, this.grid[y][x]);
                return this.grid[y][x];
            }
            return false;
        }

        onGridClick() {
            console.log(this.marker.x / this.tileSize, this.marker.y / this.tileSize);
            this.preMoveTo(this.players[0], this.marker.x / this.tileSize, this.marker.y / this.tileSize);
        }

        preMoveTo(player, x, y) {
            console.log(this.canMove(x,y));
            if(!this.canMove(x,y)) {
                console.log('return');
                return;
            }
            var that = this;
            var targetX = x ? x : this.marker.x;
            var targetY = y ? y : this.marker.y;
            console.log(
                player.getPosition().x,
                player.getPosition().y,
                targetX,
                targetY);
            this.pathfinder.findPath(
                player.getPosition().x,
                player.getPosition().y,
                targetX,
                targetY,
                function(path) {
                    if(path && path.length > 0) {
                        console.log(path);
                        path.shift();
                        that.moveTo(player, 0, 0, path, null);
                    }
                }
            );
            this.pathfinder.calculate();
        }

        moveTo(player, x,y,path,callback) {
            var me = this;
            var tile_y, tile_x;
            if(path != undefined && path.length > 0){
                tile_y = path[0].y;
                tile_x = path[0].x;
                path.shift();
            }else{
                tile_y = Math.floor(y);
                tile_x = Math.floor(x);
            }
            var tile = this.map.layers[1].data[tile_y][tile_x];
            var newX = tile.x * this.tileSize - player.spriteSize / 4;
            var newY = tile.y * this.tileSize - player.spriteSize / 2;
            player.faceTo(newX, newY);
            player.walk();
            var t = this.add.tween(
                player.entity_sprite).to({x: newX,y: newY},
                player.speed,
                Phaser.Easing.Linear.None,
                true
            );
            t.onComplete.add(function(){
                if(path != undefined && path.length > 0){
                    me.moveTo(player, 0, 0, path, callback); // recursive
                } else{
                    player.stand();
                }
            },me);
        }

        reload(game) {
            this.tickTimer = null;
            this.create();
        }
    }
}
