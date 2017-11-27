module TacticArena.Entity {
    export class Sprite extends Phaser.Sprite {
        state;
        _speed:number;
        _size;
        _ext:string;
        _animationCompleteCallback;
        textDelay;

        constructor(state, x, y, ext, type, size=64, tint=null) {
            super(state.game, x, y, type);
            this.state = state;
            this._ext = ext;
            this._speed = 200;
            this._size = size;
            this.textDelay = 0;
            this.setAnimations();
            this._animationCompleteCallback = null;
            if(tint) {
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
            this.animations.add('walkS', ["walkS2","walkS3","walkS4","walkS5","walkS6","walkS7","walkS8","walkS9"], 12, true);
            this.animations.add('walkN', ["walkN2","walkN3","walkN4","walkN5","walkN6","walkN7","walkN8","walkN9"], 12, true);
            this.animations.add('walkW', ["walkW1","walkW2","walkW3","walkW4","walkW5","walkW6","walkW7","walkW8","walkW9"], 12, true);
            this.animations.add('walkE', ["walkE1","walkE2","walkE3","walkE4","walkE5","walkE6","walkE7","walkE8","walkE9"], 12, true);
            this.animations.add('attackS', ["attackS1","attackS2","attackS3","attackS4","attackS5","attackS6"], 12, false);
            this.animations.add('attackN', ["attackN1","attackN2","attackN3","attackN4","attackN5","attackN6"], 12, false);
            this.animations.add('attackW', ["attackW1","attackW2","attackW3","attackW4","attackW5","attackW6"], 12, false);
            this.animations.add('attackE', ["attackE1","attackE2","attackE3","attackE4","attackE5","attackE6"], 12, false);
            this.animations.add('castS', ["castS1","castS2","castS3","castS3","castS3","castS4","castS5","castS6", "castS7"], 10, false);
            this.animations.add('castN', ["castN1","castN2","castN3","castN3","castN3","castN4","castN5","castN6", "castN7"], 10, false);
            this.animations.add('castW', ["castW1","castW2","castW3","castW3","castW3","castW4","castW5","castW6", "castW7"], 10, false);
            this.animations.add('castE', ["castE1","castE2","castE3","castE3","castE3","castE4","castE5","castE6", "castE7"], 10, false);
            this.animations.add('halfcastS', ["castS1","castS2","castS3"], 10, false);
            this.animations.add('halfcastN', ["castN1","castN2","castN3"], 10, false);
            this.animations.add('halfcastW', ["castW1","castW2","castW3"], 10, false);
            this.animations.add('halfcastE', ["castE1","castE2","castE3"], 10, false);
            this.animations.add('dying', ["dying1","dying2","dying3","dying4","dying5","dying6"], 10, false);
            this.events.onAnimationComplete.add(this.animationComplete, this);
        }

        animationComplete() {
            if(this._animationCompleteCallback){
                this._animationCompleteCallback();
                this._animationCompleteCallback = null;
            }

            var animationName = this.animations.currentAnim.name;
            if(animationName.indexOf('attack') >= 0) {
                this.stand();
            }
        }

        playAnimation(animation:string) {
            this.animations.play(animation);
        }

        faceTo(x:number, y:number) {
            if (this.position.x < x) {
                this._ext = 'E';
            } else if (this.position.x > x) {
                this._ext = 'W';
            }
            if (this.position.y < y) {
                this._ext = 'S';
            } else if (this.position.y > y) {
                this._ext = 'N';
            }
        }

        walk() {
            this.playAnimation('walk' + this._ext);
        }

        stand(ext=this._ext) {
            this._ext = ext;
            this.playAnimation('stand' + this._ext);
        }

        halfcast(ext=this._ext) {
            this._ext = ext;
            this.playAnimation('halfcast' + this._ext);
        }

        castFire(targets, callback?) {
            //TODO use promise, not callback
            let self = this;
            this._animationCompleteCallback = callback;
            this.playAnimation('cast' + this._ext);

            setTimeout( function() {
                let initialX = 0;
                let initialY = 0;
                let targetX = 0;
                let targetY = 0;
                let scaleX = 1;
                let angle = 0;
                if (self._ext == 'W' || self._ext == 'E') {
                    initialY = self.position.y + 40;
                    targetY = initialY;

                    initialX = self.position.x - 40;
                    targetX = initialX - 45;
                    if (self._ext == 'E') {
                        initialX = self.position.x + 110;
                        targetX = initialX + 45;
                        scaleX = -1;
                    }
                } else if (self._ext == 'N' || self._ext == 'S') {
                    initialX = self.position.x + 33;
                    targetX = initialX;

                    initialY = self.position.y - 40;
                    targetY = initialY - 45;
                    angle = 90;
                    if (self._ext == 'S') {
                        initialY = self.position.y + 110;
                        targetY = initialY + 50;
                        angle = 270;
                    }
                }
                let fireball = self.state.add.sprite(initialX, initialY, 'fireball');
                self.state.pawnsSpritesGroup.add(fireball);
                fireball.anchor.setTo(.5, .5);
                fireball.scale.x *= scaleX;
                fireball.angle += angle;
                fireball.animations.add('fire', ["fireball_04", "fireball_03", "fireball_02", "fireball_01", "fireball_02", "fireball_03", "fireball_04"], 10, false);
                fireball.animations.play('fire');

                if (targets) {
                    for (var i = 0; i < targets.length; i++) {
                    targets.forEach( target => {
                        self.state.spritesManager.getProjectionOrReal(target).hurtAnimation();
                        self.state.spritesManager.getProjectionOrReal(target).hurtText(2);
                    });
                }

                var t = self.state.add.tween(fireball).to({x: targetX, y: targetY}, 700, Phaser.Easing.Linear.None, true);
                t.onComplete.add(function () { fireball.kill(); }, self);
            }, 500);
        }

        castTornado(targets, callback?) {
            //TODO use promise, not callback
            let self = this;
            this._animationCompleteCallback = callback;
            this.playAnimation('cast' + this._ext);

            setTimeout( function() {
                let initialX = 0;
                let initialY = 0;
                let targetX = 0;
                let targetY = 0;
                let scaleX = 1;
                if (self._ext == 'W' || self._ext == 'E') {
                    initialY = self.position.y + 40;
                    targetY = initialY;
                    initialX = self.position.x;
                    targetX = initialX - 100;
                    if (self._ext == 'E') {
                        initialX = self.position.x + 65;
                        targetX = initialX + 100;
                        scaleX = -1;
                    }
                } else if (self._ext == 'N' || self._ext == 'S') {
                    initialX = self.position.x + 30;
                    targetX = initialX;
                    initialY = self.position.y + 5;
                    targetY = initialY - 110;
                    if (self._ext == 'S') {
                        initialY = self.position.y + 65;
                        targetY = initialY + 110;
                    }
                }
                let tornado = self.state.add.sprite(initialX, initialY, 'wind');
                self.state.pawnsSpritesGroup.add(tornado);
                tornado.anchor.setTo(.5, .5);
                tornado.scale.x *= scaleX;
                tornado.animations.add('wind', ["wind_01", "wind_02", "wind_03", "wind_04", "wind_05", "wind_06", "wind_07"], 7, false);
                tornado.animations.play('wind');

                if (targets) {
                    console.log(targets);
                    for (var i = 0; i < targets.length; i++) {
                        let target = targets[i];
                        setTimeout( function() {
                            self.state.spritesManager.getProjectionOrReal(target.entity).hurtAnimation();
                            self.state.spritesManager.getProjectionOrReal(target.entity).hurtText(1);
                            if(target.moved) {
                                self.state.spritesManager.getProjectionOrReal(target.entity).moveTo(target.moved.x, target.moved.y);
                            }
                        }, target.moved.d * 100);
                    }
                }

                var t = self.state.add.tween(tornado).to({x: targetX, y: targetY}, 1000, Phaser.Easing.Linear.None, true);
                t.onComplete.add(function () { tornado.kill(); }, self);
            }, 500);
        }

        castHeal(targets, callback?) {
            //TODO use promise, not callback
            this._animationCompleteCallback = callback;
            this.playAnimation('cast' + this._ext);
            let self = this;
            setTimeout( function() {
                if (targets) {
                    for (var i = 0; i < targets.length; i++) {
                        self.state.spritesManager.getProjectionOrReal(targets[i].entity).healAnimation();
                        self.state.spritesManager.getProjectionOrReal(targets[i].entity).healText(1);
                    }
                }
            }, 500);
        }

        attack(ext=this._ext, callback?) {
            //TODO use promise, not callback
            this._ext = ext;
            this._animationCompleteCallback = callback;
            this.playAnimation('attack' + this._ext);
        }

        hurtAnimation() {
            this.game.add.tween(this).to({
                tint : 0.65 * 0xffffff,
                alpha : 0.5
            }, 100, Phaser.Easing.Exponential.Out, true, 0, 0, true);
        }

        healAnimation() {
            this.game.add.tween(this).to({
                tint : 0xffffff,
                alpha : 0.5
            }, 100, Phaser.Easing.Exponential.Out, true, 0, 0, true);
        }

        die() {
            this.playAnimation('dying');
        }

        //TODO change x, y to position: Position
        moveTo(x, y, path = [], animate = true, faceDirection = false):Promise<any> {
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
                var newX = tile.x * this.state.game.tileSize - this._size / 4;
                var newY = tile.y * this.state.game.tileSize - this._size / 2;
                if (animate) {
                    if (faceDirection) {
                        this.faceTo(newX, newY);
                    }
                    if (this.animations.currentAnim.name != 'walk' + this._ext) {
                        this.walk();
                    }
                    console.log(this._speed, this.x, newX, this.y, newY);
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
                            this.stand();
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

        getPosition():Position {
            return new Position(
                (this.position.x + this._size / 4) / this.state.game.tileSize,
                (this.position.y + this._size / 2) / this.state.game.tileSize
            );
        }

        getDirection() {
            return this._ext;
        }

        hide() {
            this.alpha = 0;
        }

        show(alpha=1) {
            this.alpha = alpha;
        }

        displayText(content, color="#ffffff", fontSize=8, strokeThickness=0) {
            let label = this.game.add.text(20, 10, content, {font: fontSize + 'px Press Start 2P', fill: color,
                stroke: '#000000', strokeThickness: strokeThickness});
            let t = this.game.add.tween(label).to({x: 20, y: -20, alpha: 0}, 1000, Phaser.Easing.Linear.None, true);
            t.onComplete.add(function () {
                label.destroy();
            }, this);
            this.addChild(label);
        }

        hurtText(hp = 1) {
            let self = this;
            self.textDelay++;
            let timeOut = self.textDelay * 300;
            setTimeout(function () {
                self.displayText('-' + hp, '#ff021b', 12, 6);
                self.textDelay--;
            }, timeOut);
        }

        healText(hp = 1) {
            let self = this;
            self.textDelay++;
            let timeOut = self.textDelay * 300;
            setTimeout(function () {
                self.displayText('+' + hp, '#5ce11a', 12, 6);
                self.textDelay--;
            }, timeOut);
        }
    }
}
