module TypescriptPhaser.Entity {
    export class Player {
        private sprite;
        game;
        ghost;
        private ext:string;

        constructor(game, x, y, ext) {
            this.game = game;
            this.ghost = null;
            this.sprite = new Entity.Sprite(game, x, y, ext, this, 64);
            this.game.add.existing(this.sprite);  
            this.sprite.stand();
        }

        getPosition() {
            return {
                x: (this.sprite.position.x + this.sprite._size / 4) / this.game.tileSize,
                y: (this.sprite.position.y + this.sprite._size / 2) / this.game.tileSize
            };
        }

        preMoveTo(targetX, targetY) {
            var self = this;
            return new Promise((resolve, reject) => {
                if(!this.game.canMove(targetX, targetY)) {
                    reject(false);
                }
                this.game.pathfinder.findPath(
                    this.getPosition().x,
                    this.getPosition().y,
                    targetX,
                    targetY,
                    function(path) {
                        if(path && path.length > 0) {
                            path.shift();
                            self.moveTo(0, 0, path, null).then((res) => {
                                resolve(res);
                            });
                        }
                    }
                );
                this.game.pathfinder.calculate();
            });
        }

        moveTo(x, y, path, callback) {
            return new Promise((resolve, reject) => {
                var tile_y, tile_x;
                if (path != undefined && path.length > 0) {
                    tile_y = path[0].y;
                    tile_x = path[0].x;
                    path.shift();
                } else {
                    tile_y = Math.floor(y);
                    tile_x = Math.floor(x);
                }
                var tile = this.game.map.layers[1].data[tile_y][tile_x];
                var newX = tile.x * this.game.tileSize - this.sprite._size / 4;
                var newY = tile.y * this.game.tileSize - this.sprite._size / 2;
                this.sprite.faceTo(newX, newY);
                this.sprite.walk();
                var t = this.game.add.tween(
                    this.sprite).to({x: newX,y: newY},
                    this.sprite._speed,
                    Phaser.Easing.Linear.None,
                    true
                );
                t.onComplete.add( function(){
                    if (path != undefined && path.length > 0){
                        this.moveTo(0, 0, path, callback).then((res) => {
                            resolve(res);
                        }); // recursive
                    } else {
                        this.sprite.stand();
                        resolve(true);
                    }
                }, this);
            });
        }
    }
}
