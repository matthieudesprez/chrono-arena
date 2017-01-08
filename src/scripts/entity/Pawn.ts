module TacticArena.Entity {
    export class Pawn {
        private sprite;
        game;
        projection;
        _parent;
        _id;
        _ap;
        _hp;
        type;
        isHurt;
        isAttacking;
        attackTarget;
        hasAttacked;

        constructor(game, x, y, ext, type, id) {
            this.game = game;
            this._id = id;
            this.type = type;
            this.projection = null;
            this._parent = null;
            this.sprite = new Entity.Sprite(game, x, y, ext, type, this, 64);
            this.game.pawnsSpritesGroup.add(this.sprite);
            this.sprite.stand();
            this.isHurt = false;
            this.isAttacking = false;
            this.attackTarget = null;
            this.hasAttacked = false;
            this._hp = 4;
        }

        getReal() {
            return this._parent ? this._parent : this;
        }
        getProjectionOrReal() {
            return this.projection ? this.projection : this;
        }

        getPosition() {
            return {
                x: (this.sprite.position.x + this.sprite._size / 4) / this.game.tileSize,
                y: (this.sprite.position.y + this.sprite._size / 2) / this.game.tileSize
            };
        }

        attack(target?) {
            var that = this;
            return new Promise((resolve, reject) => {
                this.sprite.attack(target, function() {
                    that.hasAttacked = true;
                    resolve(true);
                });
            });
        }

        hurt() {
            this.sprite.hurt();
            this.destroyProjection();
            this.setHp(this._hp - 1);
        }

        preMoveTo(targetX, targetY) {
            var self = this;
            return new Promise((resolve, reject) => {
                if(!this.game.stageManager.canMove(targetX, targetY)) {
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
                            var result = JSON.parse(JSON.stringify(path));
                            self.moveTo(0, 0, path, null).then((res) => {
                                resolve(result);
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
                var tile = this.game.stageManager.map.layers[1].data[tile_y][tile_x];
                var newX = tile.x * this.game.tileSize - this.sprite._size / 4;
                var newY = tile.y * this.game.tileSize - this.sprite._size / 2;
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

        createProjection() {
            if (this.projection == null) {
                this.projection = new Entity.Pawn(
                    this.game,
                    this.getPosition().x,
                    this.getPosition().y,
                    this.sprite._ext,
                    this.type,
                    null
                );
                this.projection.parent = this;
                this.projection.sprite.alpha = 0.7;
            }
        }

        destroyProjection() {
            if(this.projection) {
                this.projection.sprite.kill();
                this.projection = null;
            }
        }


        getDirection() {
            return this.sprite._ext;
        }
        
        faceDirection(direction) {
            this.sprite._ext = direction;
            this.sprite.stand();
        }

        isFacing(position) {
            // x,y 1,0 2,0
            // 0,1 1,1 2,1
            // 0,2 1,2 2,2
            var pawnPosition = this.getPosition();
            return (
                pawnPosition.x == position.x && (
                    (pawnPosition.y == position.y + 1 && this.getDirection() == 'N')
                    || (pawnPosition.y == position.y - 1 && this.getDirection() == 'S')
                )
                || pawnPosition.y == position.y && (
                    (pawnPosition.x == position.x + 1 && this.getDirection() == 'W')
                    || (pawnPosition.x == position.x - 1 && this.getDirection() == 'E')
                )
            );
        }

        getAp() {
            return this._ap;
        }

        setAp(ap) {
            this._ap = ap;
            this.game.onApChange.dispatch(this._ap);
        }

        getHp() {
            return this._hp;
        }

        setHp(hp) {
            this._hp = hp;
            this.game.onHpChange.dispatch(this._hp);
        }
    }
}
