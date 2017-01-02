module TacticArena.Entity {
    export class Sprite extends Phaser.Sprite {
        _parent;
        _speed:number;
        _size;
        private _ext:string;
        _animationCompleteCallback;

        constructor(game, x, y, ext, type, parent, size) {
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

        attack(target?, callback?) {
            this._animationCompleteCallback = callback;
            this.playAnimation('attack' + this._ext);
            if(target) {
                target.hurt();
            }
        }

        hurt() {
            this.game.add.tween(this).to({
                tint : 0.65 * 0xffffff,
                alpha : 0.5
            }, 100, Phaser.Easing.Exponential.Out, true, 0, 0, true);
        }
    }
}
