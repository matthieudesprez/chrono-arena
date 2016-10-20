module TypescriptPhaser.Entity {
    export class Player {
        private entity_sprite:Phaser.Sprite;
        game;
        speed:number;
        spriteSize;
        ghost;
        private ext:string;

        constructor(game, x, y, ext) {
            this.game = game;
            this.ext = ext;
            this.ghost = null;
            this.speed = 200;
            this.spriteSize = 64;
            this.entity_sprite = this.game.add.sprite(
                this.game.tileSize * x - (this.spriteSize / 4),
                this.game.tileSize * y - (this.spriteSize / 2),
                'player'
            );
            this.entity_sprite.animations.add('standS', ["walkS1"], 6, true);
            this.entity_sprite.animations.add('standN', ["walkN1"], 6, true);
            this.entity_sprite.animations.add('standW', ["walkW1"], 6, true);
            this.entity_sprite.animations.add('standE', ["walkE1"], 6, true);
            this.entity_sprite.animations.add('walkS', ["walkS2","walkS3","walkS4","walkS5","walkS6","walkS7","walkS8","walkS9"], 12, true);
            this.entity_sprite.animations.add('walkN', ["walkN2","walkN3","walkN4","walkN5","walkN6","walkN7","walkN8","walkN9"], 12, true);
            this.entity_sprite.animations.add('walkW', ["walkW1","walkW2","walkW3","walkW4","walkW5","walkW6","walkW7","walkW8","walkW9"], 12, true);
            this.entity_sprite.animations.add('walkE', ["walkE1","walkE2","walkE3","walkE4","walkE5","walkE6","walkE7","walkE8","walkE9"], 12, true);
            this.stand();
        }

        getPosition() {
            return {
                x: (this.entity_sprite.position.x + this.spriteSize / 4) / this.game.tileSize,
                y: (this.entity_sprite.position.y + this.spriteSize / 2) / this.game.tileSize
            };
        }

        play(animation:string) {
            console.log(animation);
            this.entity_sprite.animations.play(animation);
        }

        faceTo(x:number, y:number) {
            if (this.entity_sprite.x < x) {
                this.ext = 'E';
            }
            else if (this.entity_sprite.x > x) {
                this.ext = 'W';
            }
            if (this.entity_sprite.y < y) {
                this.ext = 'S';
            }
            else if (this.entity_sprite.y > y) {
                this.ext = 'N';
            }
            console.log(this.entity_sprite.x, x, this.entity_sprite.y, y, this.ext);
        }

        walk() {
            this.play('walk' + this.ext);
        }

        stand() {
            this.play('stand' + this.ext);
        }

        goNorth() {
            this.game.preMoveTo(this, this.getPosition().x, this.getPosition().y - 1)
        }

        goSouth() {
            this.game.preMoveTo(this, this.getPosition().x, this.getPosition().y + 1)
        }

        goWest() {
            this.game.preMoveTo(this, this.getPosition().x - 1, this.getPosition().y)
        }

        goEast() {
            this.game.preMoveTo(this, this.getPosition().x + 1, this.getPosition().y)
        }

        goRandom() {
            var direction = this.game.rnd.integerInRange(1, 4);
            if(direction == 1) {
                this.goNorth();
            } else if(direction == 2) {
                this.goSouth();
            } else if(direction == 3) {
                this.goWest();
            } else {
                this.goEast();
            }
        }

        preMoveTo(targetX, targetY) {
             var self = this;
            return new Promise((resolve, reject) => {
                if(!self.game.canMove(targetX, targetY)) {
                    console.log(targetX, targetY);
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
                                resolve(true);
                            });
                        }
                    }
                );
                this.game.pathfinder.calculate();
            });
        }

        moveTo(x, y, path, callback) {
            return new Promise((resolve, reject) => {
                var me = this;
                var tile_y, tile_x;
                if (path != undefined && path.length > 0) {
                    tile_y = path[0].y;
                    tile_x = path[0].x;
                    path.shift();
                } else {
                    tile_y = Math.floor(y);
                    tile_x = Math.floor(x);
                }
                var tile = me.game.map.layers[1].data[tile_y][tile_x];
                console.log(path);
                var newX = tile.x * this.game.tileSize - this.spriteSize / 4;
                var newY = tile.y * this.game.tileSize - this.spriteSize / 2;
                this.faceTo(newX, newY);
                this.walk();
                var t = this.game.add.tween(
                    this.entity_sprite).to({x: newX,y: newY},
                    this.speed,
                    Phaser.Easing.Linear.None,
                    true
                );
                t.onComplete.add(function(){
                    if (path != undefined && path.length > 0){
                        this.moveTo(0, 0, path, callback); // recursive
                    } else {
                        this.stand();
                        resolve(true);
                    }
                }, me);
            });
        }
    }
}
