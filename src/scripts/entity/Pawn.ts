module TacticArena.Entity {
    export class Pawn {
        private sprite;
        game;
        projection;
        _parent;
        _id;
        _name;
        _ap;
        _hp;
        type;
        isHurt;
        isBlocked;
        isAttacking;
        attackTarget;
        hasAttacked;
        moveHasBeenBlocked;
        selected;
        bot;

        constructor(game, x, y, ext, type, id, bot, name = "") {
            this.game = game;
            this._id = id;
            this._name = name;
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
            this.moveHasBeenBlocked = false;
            this.isBlocked = false;
            this._hp = 4;
            this.selected = false;
            this.bot = bot;
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
                    that.sprite.stand();
                    that.hasAttacked = true;
                    resolve(true);
                });
            });
        }

        hurt(hp=1) {
            this.sprite.hurt();
            this.destroyProjection();
            this.setHp(this._hp - hp);

            let label_dmg = this.game.add.text(20, 10, "-" + hp, { font: '12px Press Start 2P', fill: "#ff021b", stroke: '#000000', strokeThickness: 6 });
            let t = this.game.add.tween(label_dmg).to({x: 20,y: -20, alpha: 0},
                1000,
                Phaser.Easing.Linear.None,
                true
            );
            t.onComplete.add(function() {
                label_dmg.destroy();
            }, this);
            this.sprite.addChild(label_dmg);
        }

        halfcast() {
            this.sprite.halfcast();
        }

        cast(targets) {
            var that = this;
            return new Promise((resolve, reject) => {
                this.sprite.cast(targets, function() {
                    that.sprite.stand();
                    that.hasAttacked = true;
                    resolve(true);
                });
            });
        }

        dodge() {
            let label_score = this.game.add.text(20, 10, "miss", { font: '8px Press Start 2P', fill: "#ffffff" });
            let t = this.game.add.tween(label_score).to({x: 20,y: -20, alpha: 0},
                1000,
                Phaser.Easing.Linear.None,
                true
                );
            t.onComplete.add(function() {
                label_score.destroy();
            }, this);
            this.sprite.addChild(label_score);
        }

        blocked() {
            let label_score = this.game.add.text(20, 10, "block", { font: '8px Press Start 2P', fill: "#ffffff" });
            let t = this.game.add.tween(label_score).to({x: 20,y: -20, alpha: 0},
                1000,
                Phaser.Easing.Linear.None,
                true
                );
            t.onComplete.add(function() {
                label_score.destroy();
            }, this);
            this.sprite.addChild(label_score);
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
                            self.moveTo(0, 0, path).then((res) => {
                                self.destroyProjectionIfSamePosition();
                                resolve(result);
                            });
                        }
                    }
                );
                this.game.pathfinder.calculate();
            });
        }

        moveTo(x, y, path, animate = true) {
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
                if(animate) {
                    this.sprite.walk();
                    var t = this.game.add.tween(
                        this.sprite).to({x: newX, y: newY},
                        this.sprite._speed,
                        Phaser.Easing.Linear.None,
                        true
                    );
                    t.onComplete.add(function () {
                        if (path != undefined && path.length > 0) {
                            this.moveTo(0, 0, path).then((res) => {
                                resolve(res);
                            }); // recursive
                        } else {
                            this.sprite.stand();
                            resolve(true);
                        }
                    }, this);
                } else {
                    this.sprite.x = newX;
                    this.sprite.y = newY;
                    resolve(true);
                }
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
                    null,
                    false
                );
                this.projection.parent = this;
                this.projection.sprite.alpha = 0.7;
            }
        }

        destroyProjectionIfSamePosition() {
            if(this.projection) {
                let p1 = this.getPosition();
                let p2 = this.projection.getPosition();
                if(p1.x == p2.x && p1.y == p2.y) {
                    this.destroyProjection();
                }
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
        
        faceDirection(direction, x=null, y=null, animate=false) {
            this.sprite._ext = direction;
            let p = this.getPosition();
            if(x && y && (p.x != x || p.y != y)) {
                this.moveTo(x, y, [], animate).then((res) => {
                    //resolve(result);
                });
            } else {
                this.sprite.stand();
                //resolve(result);
            }
        }

        hide() {
            this.sprite.alpha = 0;
        }

        show(alpha=1) {
            this.sprite.alpha = alpha;
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
