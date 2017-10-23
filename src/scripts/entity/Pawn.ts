module TacticArena.Entity {
    export class Pawn {
        game;
        _parent;
        _id;
        _name;
        _ap;
        _hp;
        _mp;
        _apMax;
        _hpMax;
        _mpMax;
        type;
        selected;
        isBot;
        team;
        hurting;
        healing;
        spriteClass:typeof Entity.Sprite;
        skills;
        position:Position;
        direction;

        constructor(game, x, y, direction, type, id, bot, team, name = "", spriteClass:typeof Entity.Sprite = Entity.Sprite) {
            this.game = game;
            this._id = id;
            this._name = name;
            this.type = type;
            this._parent = null;
            this.position = new Position(x, y);
            this.direction = direction;
            let tint = null; //team != this.game.playerTeam ? this.game.teamColors[team-1] : null;
            //TODO séparer pawn et sprite pour avoir des pawns serializable (sans le game de phaser)
            this.spriteClass = spriteClass;
            this._hp = 4;
            this._ap = 0;
            this._mp = 0;
            this._hpMax = 4;
            this._apMax = 3;
            this._mpMax = 2;
            this.selected = false;
            this.isBot = bot;
            this.team = team;
            this.hurting = 0;
            this.healing = 0;
            this.skills = [];
        }

        getPosition():Position {
            //return new Position(
            //    (this.sprite.position.x + this.sprite._size / 4) / this.game.tileSize,
            //    (this.sprite.position.y + this.sprite._size / 2) / this.game.tileSize
            //);
            return this.position;
        }

        hurt(hp = 1) {
            let self = this;
            self.hurting++;
            let timeOut = self.hurting * 300;
            setTimeout(function () {
                if (self.hurting == 1) {
                    self.game.spritesManager.sprites[self._id].hurt();
                }
                self.destroyProjection();
                let label_dmg = self.game.add.text(20, 10, "-" + hp, {
                    font: '12px Press Start 2P',
                    fill: "#ff021b",
                    stroke: '#000000',
                    strokeThickness: 6
                }, self.game.pawnsSpritesGroup);
                let t = self.game.add.tween(label_dmg).to({
                    x: 20,
                    y: -20,
                    alpha: 0
                }, 1000, Phaser.Easing.Linear.None, true);
                t.onComplete.add(function () {
                    label_dmg.destroy();
                }, self);
                self.game.spritesManager.sprites[self._id].addChild(label_dmg);
                self.hurting--;
            }, timeOut);
        }

        heal(hp = 1) {
            let self = this;
            self.healing++;
            let timeOut = self.healing * 300;
            setTimeout(function () {
                if (self.healing == 1) {
                    self.game.spritesManager.sprites[self._id].healAnimation();
                }
                self.destroyProjection();
                let label_heal = self.game.add.text(20, 10, "+" + hp, {
                    font: '12px Press Start 2P',
                    fill: "#5ce11a",
                    stroke: '#000000',
                    strokeThickness: 6
                }, self.game.pawnsSpritesGroup);
                let t = self.game.add.tween(label_heal).to({
                    x: 20,
                    y: -20,
                    alpha: 0
                }, 1000, Phaser.Easing.Linear.None, true);
                t.onComplete.add(function () {
                    label_heal.destroy();
                }, self);
                self.game.spritesManager.sprites[self._id].addChild(label_heal);
                self.healing--;
            }, timeOut);
        }

        cast(targets, direction) {
            var that = this;
            return new Promise((resolve, reject) => {
                if (this.projection) {
                    this.projection.hide();
                    this.show();
                }
                this.faceDirection(direction);
                this.game.spritesManager.sprites[this._id].cast(targets, function () {
                    that.game.spritesManager.sprites[that._id].stand();
                    resolve(true);
                });
            });
        }

        castTornado(targets, direction) {
            var that = this;
            return new Promise((resolve, reject) => {
                if (this.projection) {
                    this.projection.hide();
                    this.show();
                }
                this.faceDirection(direction);
                this.game.spritesManager.sprites[this._id].castTornado(targets, function () {
                    that.game.spritesManager.sprites[that._id].stand();
                    resolve(true);
                });
            });
        }

        castHeal(targets, direction) {
            var that = this;
            return new Promise((resolve, reject) => {
                if (this.projection) {
                    this.projection.hide();
                    this.show();
                }
                this.faceDirection(direction);
                this.game.spritesManager.sprites[this._id].castHeal(targets, function () {
                    that.game.spritesManager.sprites[that._id].stand();
                    resolve(true);
                });
            });
        }

        dodge() {
            let label = this.game.add.text(20, 10, "miss", {font: '8px Press Start 2P', fill: "#ffffff"});
            let t = this.game.add.tween(label).to({x: 20, y: -20, alpha: 0}, 1000, Phaser.Easing.Linear.None, true);
            t.onComplete.add(function () {
                label.destroy();
            }, this);
            this.game.spritesManager.sprites[this._id].addChild(label);
        }

        blocked() {
            let label = this.game.add.text(20, 10, "block", {font: '8px Press Start 2P', fill: "#ffffff"});
            let t = this.game.add.tween(label).to({x: 20, y: -20, alpha: 0}, 1000, Phaser.Easing.Linear.None, true);
            t.onComplete.add(function () {
                label.destroy();
            }, this);
            this.game.spritesManager.sprites[this._id].addChild(label);
        }

        isAlive() {
            return this._hp > 0;
        }

        moveTo(x, y, path = [], animate = true, faceDirection = false) {
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
                var newX = tile.x * this.game.game.tileSize - this.game.spritesManager.sprites[this._id]._size / 4;
                var newY = tile.y * this.game.game.tileSize - this.game.spritesManager.sprites[this._id]._size / 2;
                if (animate) {
                    if (faceDirection) {
                        this.game.spritesManager.sprites[this._id].faceTo(newX, newY);
                    }
                    if (this.game.spritesManager.sprites[this._id].animations.currentAnim.name != 'walk' + this.game.spritesManager.sprites[this._id]._ext) {
                        this.game.spritesManager.sprites[this._id].walk();
                    }
                    var t = this.game.add.tween(this.game.spritesManager.sprites[this._id]).to({
                        x: newX,
                        y: newY
                    }, this.game.spritesManager.sprites[this._id]._speed, Phaser.Easing.Linear.None, true);
                    t.onComplete.add(function () {
                        if (path != undefined && path.length > 0) {
                            this.moveTo(0, 0, path, animate, faceDirection).then((res) => {
                                resolve(res);
                            }); // recursive
                        } else {
                            this.sprite.stand();
                            resolve(true);
                        }
                    }, this);
                } else {
                    this.game.spritesManager.sprites[this._id].x = newX;
                    this.game.spritesManager.sprites[this._id].y = newY;
                    resolve(true);
                }
            });
        }

        createProjection() {
            this.game.spritesManager.createProjection(this);
        }

        destroyProjection() {
            this.game.spritesManager.destroyProjection(this);
        }


        getDirection() {
            return this.game.spritesManager.sprites[this._id]._ext;
        }

        faceDirection(direction) {
            this.direction = direction;
            this.game.signalManager.onPawnDirectionChange.dispatch(this);
        }

        getAp() {
            return this._ap;
        }

        setAp(ap) {
            this._ap = ap;
            this.game.signalManager.onApChange.dispatch(this);
        }

        getMp() {
            return this._mp;
        }

        setMp(mp) {
            this._mp = mp;
            this.game.signalManager.onMpChange.dispatch(this);
        }

        getHp() {
            return this._hp;
        }

        setHp(hp, forceAnimation=false) {
            if ((this.isAlive() || forceAnimation) && hp <= 0) {
                this.game.spritesManager.sprites[this._id].die();
            }
            this._hp = (hp > this._hpMax) ? this._hpMax : hp;
            this.game.signalManager.onHpChange.dispatch(this);
        }

        getSprite() {
            return this.game.spritesManager.sprites[this._id];
        }

        export() {
            return {
                _id: this._id,
                direction: this.getDirection(),
                position: this.getPosition(),
                hp: this.getHp(),
                name: this._name,
                type: this.type,
                spriteClass: this.spriteClass
            }
        }
    }
}
