module TacticArena.Sprite {
    export class MobSpriteSimple extends BaseSprite {

        constructor(game, x, y, ext, type, parent, size, tint=null) {
            super(game, x, y, ext, type, size, tint=null);
            this.anchor.set(-0.5);
        }

        setAnimations() {
            this.animations.add('standS', ['move_s_01', 'move_s_02', 'move_s_03'], 6, true);
            this.animations.add('standN', ['move_n_01', 'move_n_02', 'move_n_03'], 6, true);
            this.animations.add('standW', ['move_w_01', 'move_w_02', 'move_w_03'], 6, true);
            this.animations.add('standE', ['move_e_01', 'move_e_02', 'move_e_03'], 6, true);
            this.animations.add('walkS', ['move_s_01', 'move_s_02', 'move_s_03'], 12, false);
            this.animations.add('walkN', ['move_n_01', 'move_n_02', 'move_n_03'], 12, false);
            this.animations.add('walkW', ['move_w_01', 'move_w_02', 'move_w_03'], 12, false);
            this.animations.add('walkE', ['move_e_01', 'move_e_02', 'move_e_03'], 12, false);
            this.animations.add('attackS', ['move_s_01', 'move_s_02', 'move_s_03'], 12, false);
            this.animations.add('attackN', ['move_n_01', 'move_n_02', 'move_n_03'], 12, false);
            this.animations.add('attackW', ['move_w_01', 'move_w_02', 'move_w_03'], 12, false);
            this.animations.add('attackE', ['move_e_01', 'move_e_02', 'move_e_03'], 12, false);
            this.animations.add('castS', ['move_s_01', 'move_s_02', 'move_s_03'], 10, false);
            this.animations.add('castN', ['move_n_01', 'move_n_02', 'move_n_03'], 10, false);
            this.animations.add('castW', ['move_w_01', 'move_w_02', 'move_w_03'], 10, false);
            this.animations.add('castE', ['move_e_01', 'move_e_02', 'move_e_03'], 10, false);
            this.animations.add('halfcastS', ['move_s_01', 'move_s_02', 'move_s_03'], 10, false);
            this.animations.add('halfcastN', ['move_n_01', 'move_n_02', 'move_n_03'], 10, false);
            this.animations.add('halfcastW', ['move_w_01', 'move_w_02', 'move_w_03'], 10, false);
            this.animations.add('halfcastE', ['move_e_01', 'move_e_02', 'move_e_03'], 10, false);
            this.animations.add('dying', ['move_s_01', 'move_s_02', 'move_s_03'], 10, false);
            this.events.onAnimationComplete.add(this.animationComplete, this);
        }

        //attack(ext=this._ext) {
            //let self = this;
            //super.attack(callback);
            //let newX = self.position.x;
            //let newY = self.position.y;
            //if (this._ext == 'E') {
            //    newX += 10;
            //} else if (this._ext == 'W') {
            //    newX -= 10;
            //} else if (this._ext == 'N') {
            //    newY -= 10;
            //} else if (this._ext == 'S') {
            //    newY += 10;
            //}
            //this.game.add.tween(this).to({
            //    x: newX,
            //    y: newY
            //}, 100, Phaser.Easing.Exponential.Out, true, 0, 0, true);
        //}
    }
}
