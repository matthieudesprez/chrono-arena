module TacticArena.Sprite {
    export class TrollSprite extends Sprite.BaseSprite {

        constructor(state, x, y, ext, type, size = 150, tint = null) {
            super(state, x, y, ext, type, size, tint);
            this.anchor.set(0.4, 0.45);
        }

        setAnimations() {
            this.animations.add('standS', Array(8).fill(null).map((_, i) => 'Idle/2/' + i), 8, true);
            this.animations.add('standN', Array(8).fill(null).map((_, i) => 'Idle/0/' + i), 8, true);
            this.animations.add('standW', Array(8).fill(null).map((_, i) => 'Idle/3/' + i), 8, true);
            this.animations.add('standE', Array(8).fill(null).map((_, i) => 'Idle/1/' + i), 8, true);
            this.animations.add('walkS', Array(8).fill(null).map((_, i) => 'Move/2/' + i), 12, true);
            this.animations.add('walkN', Array(8).fill(null).map((_, i) => 'Move/0/' + i), 12, true);
            this.animations.add('walkW', Array(8).fill(null).map((_, i) => 'Move/3/' + i), 12, true);
            this.animations.add('walkE', Array(8).fill(null).map((_, i) => 'Move/1/' + i), 12, true);
            this.animations.add('attackS', Array(12).fill(null).map((_, i) => 'Attack/2/' + i).concat(['Idle/2/0']), 12, false);
            this.animations.add('attackN', Array(12).fill(null).map((_, i) => 'Attack/0/' + i).concat(['Idle/0/0']), 12, false);
            this.animations.add('attackW', Array(12).fill(null).map((_, i) => 'Attack/3/' + i).concat(['Idle/3/0']), 12, false);
            this.animations.add('attackE', Array(12).fill(null).map((_, i) => 'Attack/1/' + i).concat(['Idle/1/0']), 12, false);
            this.animations.add('castS', Array(8).fill(null).map((_, i) => 'Idle/2/' + i), 10, false);
            this.animations.add('castN', Array(8).fill(null).map((_, i) => 'Idle/0/' + i), 10, false);
            this.animations.add('castW', Array(8).fill(null).map((_, i) => 'Idle/3/' + i), 10, false);
            this.animations.add('castE', Array(8).fill(null).map((_, i) => 'Idle/1/' + i), 10, false);
            this.animations.add('halfcastS', Array(8).fill(null).map((_, i) => 'Idle/2/' + i), 10, false);
            this.animations.add('halfcastN', Array(8).fill(null).map((_, i) => 'Idle/0/' + i), 10, false);
            this.animations.add('halfcastW', Array(8).fill(null).map((_, i) => 'Idle/3/' + i), 10, false);
            this.animations.add('halfcastE', Array(8).fill(null).map((_, i) => 'Idle/1/' + i), 10, false);
            this.animations.add('dying', Array(8).fill(null).map((_, i) => 'Idle/2/' + i), 10, false);
            this.events.onAnimationComplete.add(this.animationComplete, this);
        }

        update() {
            if(this._ext === 'S') {
                this.anchor.set(0.48, 0.45);
            } else if(this._ext === 'N') {
                this.anchor.set(0.36, 0.45);
            } else {
                this.anchor.set(0.4, 0.45);
            }
        }
    }
}
