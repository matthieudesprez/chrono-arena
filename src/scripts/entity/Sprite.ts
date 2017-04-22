module TacticArena.Entity {
    export class Sprite extends Phaser.Sprite {
        _parent;
        _speed:number;
        _size;
        private _ext:string;
        _animationCompleteCallback;

        constructor(game, x, y, ext, type, parent, size, tint=null) {
            super(
                game.game, 
                game.tileSize * x - (size / 4), 
                game.tileSize * y - (size / 2), 
                type
            );
            this._parent = parent;
            this._ext = ext;
            this._speed = 200;
            this._size = size;
            this.setAnimations();
            this._animationCompleteCallback = null;
            if(tint) {
                this.tint = tint;
            }
        }

        setAnimations() {
            this.animations.add('standS', ["walkS1"], 6, false);
            this.animations.add('standN', ["walkN1"], 6, false);
            this.animations.add('standW', ["walkW1"], 6, false);
            this.animations.add('standE', ["walkE1"], 6, false);
            this.animations.add('walkS', ["walkS2","walkS3","walkS4","walkS5","walkS6","walkS7","walkS8","walkS9"], 12, false);
            this.animations.add('walkN', ["walkN2","walkN3","walkN4","walkN5","walkN6","walkN7","walkN8","walkN9"], 12, false);
            this.animations.add('walkW', ["walkW1","walkW2","walkW3","walkW4","walkW5","walkW6","walkW7","walkW8","walkW9"], 12, false);
            this.animations.add('walkE', ["walkE1","walkE2","walkE3","walkE4","walkE5","walkE6","walkE7","walkE8","walkE9"], 12, false);
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

        update() {
            if(this._parent.game.selecting && this._parent.projection != null) {
                let p1 = this._parent.getPosition();
                let p2 = this._parent.projection.getPosition();
                if (p1.x == p2.x && p1.y == p2.y) {
                    this._parent.hide();
                } else {
                    this._parent.show();
                }
            }
        }

        faceTo(x:number, y:number) {
            if (this.position.x < x) {
                this._ext = 'E';
            }
            else if (this.position.x > x) {
                this._ext = 'W';
            }
            if (this.position.y < y) {
                this._ext = 'S';
            }
            else if (this.position.y > y) {
                this._ext = 'N';
            }
        }

        walk() {
            this.playAnimation('walk' + this._ext);
        }

        stand() {
            this.playAnimation('stand' + this._ext);
        }

        halfcast() {
            this.playAnimation('halfcast' + this._ext);
        }

        cast(targets, callback?) {
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
                let fireball = self._parent.game.add.sprite(initialX, initialY, 'fireball');
                self._parent.game.pawnsSpritesGroup.add(fireball);
                fireball.anchor.setTo(.5, .5);
                fireball.scale.x *= scaleX;
                fireball.angle += angle;
                fireball.animations.add('fire', ["fireball_04", "fireball_03", "fireball_02", "fireball_01", "fireball_02", "fireball_03", "fireball_04"], 10, false);
                fireball.animations.play('fire');

                if (targets) {
                    for (var i = 0; i < targets.length; i++) {
                        targets[i].hurt(2);
                    }
                }

                var t = self._parent.game.add.tween(fireball).to({x: targetX, y: targetY}, 700, Phaser.Easing.Linear.None, true);
                t.onComplete.add(function () { fireball.kill(); }, self);
            }, 500);
        }

        attack(target?, callback?) {
            this._animationCompleteCallback = callback;
            this.playAnimation('attack' + this._ext);
            if(target.dodge) {
                target.entity.dodge();
            } else {
                target.entity.hurt();
            }
        }

        hurt() {
            this.game.add.tween(this).to({
                tint : 0.65 * 0xffffff,
                alpha : 0.5
            }, 100, Phaser.Easing.Exponential.Out, true, 0, 0, true);
        }

        die() {
            this.playAnimation('dying');
        }
    }
}
