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
        _apMax;
        _hpMax;
        type;
        selected;
        isBot;

        constructor(game, x, y, ext, type, id, bot, name = "") {
            this.game = game;
            this._id = id;
            this._name = name;
            this.type = type;
            this.projection = null;
            this._parent = null;
            if(type) {
                this.sprite = new Entity.Sprite(game, x, y, ext, type, this, 64);
                this.game.pawnsSpritesGroup.add(this.sprite);
                this.sprite.stand();
            }
            this._hp = 4;
            this._hpMax = 4;
            this._apMax = 3;
            this.selected = false;
            this.isBot = bot;
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
                    resolve(true);
                });
            });
        }

        hurt(hp=1) {
            this.sprite.hurt();
            this.destroyProjection();
            let label_dmg = this.game.add.text(20, 10, "-" + hp, { font: '12px Press Start 2P', fill: "#ff021b", stroke: '#000000', strokeThickness: 6 });
            let t = this.game.add.tween(label_dmg).to({x: 20,y: -20, alpha: 0}, 1000, Phaser.Easing.Linear.None, true);
            t.onComplete.add(function() { label_dmg.destroy(); }, this);
            this.sprite.addChild(label_dmg);
        }

        halfcast() {
            this.sprite.halfcast();
        }

        cast(targets, direction) {
            var that = this;
            return new Promise((resolve, reject) => {
                if(this.projection) {
                    this.projection.hide();
                }
                this.faceDirection(direction);
                this.sprite.cast(targets, function() {
                    that.sprite.stand();
                    resolve(true);
                });
            });
        }

        dodge() {
            let label = this.game.add.text(20, 10, "miss", { font: '8px Press Start 2P', fill: "#ffffff" });
            let t = this.game.add.tween(label).to({x: 20,y: -20, alpha: 0}, 1000, Phaser.Easing.Linear.None, true);
            t.onComplete.add(function() { label.destroy(); }, this);
            this.sprite.addChild(label);
        }

        blocked() {
            let label = this.game.add.text(20, 10, "block", { font: '8px Press Start 2P', fill: "#ffffff" });
            let t = this.game.add.tween(label).to({x: 20,y: -20, alpha: 0}, 1000, Phaser.Easing.Linear.None, true);
            t.onComplete.add(function() {
                label.destroy();
            }, this);
            this.sprite.addChild(label);
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
                    var t = this.game.add.tween(this.sprite).to({x: newX, y: newY}, this.sprite._speed, Phaser.Easing.Linear.None, true);
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
        
        faceDirection(direction) {
            this.sprite._ext = direction;
            this.sprite.stand();
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
            this.game.signalManager.onApChange.dispatch(this._ap);
        }

        getHp() {
            return this._hp;
        }

        setHp(hp) {
            this._hp = hp;
            this.game.signalManager.onHpChange.dispatch(this._hp);
        }
    }
}
