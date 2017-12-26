module TacticArena.Sprite {
    export class BaseSprite extends Phaser.Sprite {
        state;
        _speed: number;
        _size;
        _ext: string;
        _animationCompleteCallback;
        textDelay;

        constructor(state, x, y, ext, type, size = 64, tint = null) {
            super(state.game, x, y, type);
            this.state = state;
            this._ext = ext;
            this._speed = 200;
            this._size = size;
            this.textDelay = 0;
            this.setAnimations();
            this._animationCompleteCallback = null;
            if (tint) {
                this.tint = tint;
            }
            this.anchor.set(0);
            this.stand();
        }

        setAnimations() {
            this.animations.add('standS', ["walkS1"], 6, false);
            this.animations.add('standN', ["walkN1"], 6, false);
            this.animations.add('standW', ["walkW1"], 6, false);
            this.animations.add('standE', ["walkE1"], 6, false);
            this.animations.add('walkS', ["walkS2", "walkS3", "walkS4", "walkS5", "walkS6", "walkS7", "walkS8", "walkS9"], 12, true);
            this.animations.add('walkN', ["walkN2", "walkN3", "walkN4", "walkN5", "walkN6", "walkN7", "walkN8", "walkN9"], 12, true);
            this.animations.add('walkW', ["walkW1", "walkW2", "walkW3", "walkW4", "walkW5", "walkW6", "walkW7", "walkW8", "walkW9"], 12, true);
            this.animations.add('walkE', ["walkE1", "walkE2", "walkE3", "walkE4", "walkE5", "walkE6", "walkE7", "walkE8", "walkE9"], 12, true);
            this.animations.add('attackS', ["attackS1", "attackS2", "attackS3", "attackS4", "attackS5", "attackS6", "walkS1"], 12, false);
            this.animations.add('attackN', ["attackN1", "attackN2", "attackN3", "attackN4", "attackN5", "attackN6", "walkN1"], 12, false);
            this.animations.add('attackW', ["attackW1", "attackW2", "attackW3", "attackW4", "attackW5", "attackW6", "walkW1"], 12, false);
            this.animations.add('attackE', ["attackE1", "attackE2", "attackE3", "attackE4", "attackE5", "attackE6", "walkE1"], 12, false);
            this.animations.add('castS', ["castS1", "castS2", "castS3", "castS3", "castS3", "castS4", "castS5", "castS6", "castS7", "walkS1"], 10, false);
            this.animations.add('castN', ["castN1", "castN2", "castN3", "castN3", "castN3", "castN4", "castN5", "castN6", "castN7", "walkN1"], 10, false);
            this.animations.add('castW', ["castW1", "castW2", "castW3", "castW3", "castW3", "castW4", "castW5", "castW6", "castW7", "walkW1"], 10, false);
            this.animations.add('castE', ["castE1", "castE2", "castE3", "castE3", "castE3", "castE4", "castE5", "castE6", "castE7", "walkE1"], 10, false);
            this.animations.add('halfcastS', ["castS1", "castS2", "castS3", "walkS1"], 10, false);
            this.animations.add('halfcastN', ["castN1", "castN2", "castN3", "walkN1"], 10, false);
            this.animations.add('halfcastW', ["castW1", "castW2", "castW3", "walkW1"], 10, false);
            this.animations.add('halfcastE', ["castE1", "castE2", "castE3", "walkE1"], 10, false);
            this.animations.add('dying', ["dying1", "dying2", "dying3", "dying4", "dying5", "dying6"], 10, false);
            this.events.onAnimationComplete.add(this.animationComplete, this);
        }

        animationComplete() {
            if (this._animationCompleteCallback) {
                this._animationCompleteCallback();
                this._animationCompleteCallback = null;
            }
        }

        playAnimation(animation: string) {
            this.animations.play(animation);
        }

        faceTo(x: number, y: number) {
            if (this.position.x < x) {
                this._ext = 'E';
            } else if (this.position.x > x) {
                this._ext = 'W';
            } else if (this.position.y < y) {
                this._ext = 'S';
            } else if (this.position.y > y) {
                this._ext = 'N';
            }
        }

        walk() {
            this.playAnimation('walk' + this._ext);
        }

        stand(ext = this._ext) {
            return new Promise((resolve, reject) => {
                this._ext = ext;
                this._animationCompleteCallback = function () {
                    resolve(true);
                };
                this.playAnimation('stand' + this._ext);
            });
        }

        halfcast(ext = this._ext) {
            this._ext = ext;
            this.playAnimation('halfcast' + this._ext);
        }

        attack(ext = this._ext) {
            return new Promise((resolve, reject) => {
                this._ext = ext;
                this._animationCompleteCallback = function () {
                    this.stand();
                    resolve(true);
                };
                this.playAnimation('attack' + this._ext);
            });
        }

        cast(ext = this._ext, speed = 1000) {
            return new Promise((resolve, reject) => {
                this._ext = ext;
                this.playAnimation('cast' + this._ext);
                setTimeout(function () {
                    resolve(true);
                }, speed);
            });
        }

        blink(tintFactor = 1, alpha = 0.5, speed = 100, ease = Phaser.Easing.Exponential.Out) {
            let self = this;
            let t = this.game.add.tween(this).to({
                tint: tintFactor * 0xffffff,
                alpha: alpha
            }, speed, ease, true, 0, 0, true);
            t.onComplete.add(function () {
                self.tint = 0xffffff;
                self.alpha = 1;
            }, this);
        }

        hurtAnimation() {
            this.blink(0.65)
        }

        healAnimation() {
            this.blink(3.7, 1);
        }

        die(animate = true) {
            return new Promise((resolve, reject) => {
                if (this.frameName === 'dying6' || !animate) {
                    this.frameName = 'dying6';
                    resolve(true);
                } else {
                    this._animationCompleteCallback = function () {
                        resolve(true);
                    };
                    this.playAnimation('dying');
                }
            });
        }

        //TODO change x, y to position: Position
        moveTo(x, y, path = [], animate = true, faceDirection = false, playWalkAnimation = true): Promise<any> {
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
                var tile = this.state.stageManager.map.layers[1].data[tile_y][tile_x];
                var newX = tile.x * this.state.game.tileSize; // - this._size / 4;
                var newY = tile.y * this.state.game.tileSize; // - this._size / 2;
                if (this.x == newX && this.y == newY) {
                    return resolve(true);
                }
                if (animate) {
                    if (faceDirection) {
                        this.faceTo(newX, newY);
                    }
                    if (playWalkAnimation && this.animations.currentAnim.name != 'walk' + this._ext) {
                        this.walk();
                    }
                    var t = this.game.add.tween(this).to({
                        x: newX,
                        y: newY
                    }, this._speed, Phaser.Easing.Linear.None, true);
                    t.onComplete.add(function () {
                        if (path != undefined && path.length > 0) {
                            this.moveTo(0, 0, path, animate, faceDirection).then((res) => {
                                resolve(res);
                            }); // recursive
                        } else {
                            resolve(true);
                        }
                    }, this);
                } else {
                    this.x = newX;
                    this.y = newY;
                    resolve(true);
                }
            });
        }

        getPosition(): Position {
            return new Position(
                this.position.x / this.state.game.tileSize,
                this.position.y / this.state.game.tileSize,
                this._ext
            );
        }

        getRawPosition(): Position {
            return new Position(
                this.position.x,
                this.position.y
            );
        }

        getDirection() {
            return this._ext;
        }

        hide() {
            this.alpha = 0;
        }

        show(alpha = 1) {
            this.alpha = alpha;
        }

        displayText(content, color = "#ffffff", fontSize = 8, strokeThickness = 0) {
            // TODO return a promise un queueAction and in hurtText & healText because in UT, it passes here after the game is destroyed with the setTimeOut
            if (this.game) {
                let label = new Phaser.Text(this.game, 20, 10, content, {
                    font: fontSize + 'px Press Start 2P', fill: color,
                    stroke: '#000000', strokeThickness: strokeThickness
                });
                let t = this.game.add.tween(label).to({x: 20, y: -20, alpha: 0}, 1000, Phaser.Easing.Linear.None, true);
                t.onComplete.add(function () {
                    label.destroy();
                }, this);
                this.addChild(label);
            }
        }

        queueAction(action) {
            let self = this;
            self.textDelay++;
            let timeOut = self.textDelay * 300;
            setTimeout(function () {
                action();
                self.textDelay--;
            }, timeOut);
        }

        hurtText(hp = 1) {
            let self = this;
            this.queueAction(function () {
                self.displayText('-' + hp, '#ff021b', 12, 6);
            });
        }

        healText(hp = 1) {
            let self = this;
            this.queueAction(function () {
                self.displayText('+' + hp, '#5ce11a', 12, 6);
            });
        }
    }
}
