/// <reference path="Sprite.ts"/>
module TacticArena.Entity {
    export class MobSprite extends TacticArena.Entity.Sprite {

        constructor(game, x, y, ext, type, parent, size, tint=null) {
            super(game, x, y, ext, type, parent, size, tint=null);
        }

        setAnimations() {
            this.animations.add('standS', ['stand_01', 'stand_02', 'stand_03', 'stand_04', 'stand_05', 'stand_06', 'stand_07', 'stand_08', 'stand_09', 'stand_10'], 6, true);
            this.animations.add('standN', ['stand_01', 'stand_02', 'stand_03', 'stand_04', 'stand_05', 'stand_06', 'stand_07', 'stand_08', 'stand_09', 'stand_10'], 6, true);
            this.animations.add('standW', ['stand_01_mirror', 'stand_02_mirror', 'stand_03_mirror', 'stand_04_mirror', 'stand_05_mirror', 'stand_06_mirror', 'stand_07_mirror', 'stand_08_mirror', 'stand_09_mirror', 'stand_10_mirror'], 6, true);
            this.animations.add('standE', ['stand_01', 'stand_02', 'stand_03', 'stand_04', 'stand_05', 'stand_06', 'stand_07', 'stand_08', 'stand_09', 'stand_10'], 6, true);
            this.animations.add('walkS', ['walk_01', 'walk_02', 'walk_03', 'walk_04', 'walk_05', 'walk_06', 'walk_07', 'walk_08', 'walk_09', 'walk_10'], 12, false);
            this.animations.add('walkN', ['walk_01', 'walk_02', 'walk_03', 'walk_04', 'walk_05', 'walk_06', 'walk_07', 'walk_08', 'walk_09', 'walk_10'], 12, false);
            this.animations.add('walkW', ['walk_01_mirror', 'walk_02_mirror', 'walk_03_mirror', 'walk_04_mirror', 'walk_05_mirror', 'walk_06_mirror', 'walk_07_mirror', 'walk_08_mirror', 'walk_09_mirror', 'walk_10_mirror'], 12, false);
            this.animations.add('walkE', ['walk_01', 'walk_02', 'walk_03', 'walk_04', 'walk_05', 'walk_06', 'walk_07', 'walk_08', 'walk_09', 'walk_10'], 12, false);
            this.animations.add('attackS', ['attack_01', 'attack_02', 'attack_03', 'attack_04', 'attack_05', 'attack_06', 'attack_07', 'attack_08', 'attack_09', 'attack_10'], 12, false);
            this.animations.add('attackN', ['attack_01', 'attack_02', 'attack_03', 'attack_04', 'attack_05', 'attack_06', 'attack_07', 'attack_08', 'attack_09', 'attack_10'], 12, false);
            this.animations.add('attackW', ['attack_01_mirror', 'attack_02_mirror', 'attack_03_mirror', 'attack_04_mirror', 'attack_05_mirror', 'attack_06_mirror', 'attack_07_mirror', 'attack_08_mirror', 'attack_09_mirror', 'attack_10_mirror'], 12, false);
            this.animations.add('attackE', ['attack_01', 'attack_02', 'attack_03', 'attack_04', 'attack_05', 'attack_06', 'attack_07', 'attack_08', 'attack_09', 'attack_10'], 12, false);
            this.animations.add('castS', ['gesture_01', 'gesture_02', 'gesture_03', 'gesture_04', 'gesture_05', 'gesture_06', 'gesture_07', 'gesture_08', 'gesture_09', 'gesture_10'], 10, false);
            this.animations.add('castN', ['gesture_01', 'gesture_02', 'gesture_03', 'gesture_04', 'gesture_05', 'gesture_06', 'gesture_07', 'gesture_08', 'gesture_09', 'gesture_10'], 10, false);
            this.animations.add('castW', ['gesture_01_mirror', 'gesture_02_mirror', 'gesture_03_mirror', 'gesture_04_mirror', 'gesture_05_mirror', 'gesture_06_mirror', 'gesture_07_mirror', 'gesture_08_mirror', 'gesture_09_mirror', 'gesture_10_mirror'], 10, false);
            this.animations.add('castE', ['gesture_01', 'gesture_02', 'gesture_03', 'gesture_04', 'gesture_05', 'gesture_06', 'gesture_07', 'gesture_08', 'gesture_09', 'gesture_10'], 10, false);
            this.animations.add('halfcastS', ['gesture_01', 'gesture_02', 'gesture_03'], 10, false);
            this.animations.add('halfcastN', ['gesture_01', 'gesture_02', 'gesture_03'], 10, false);
            this.animations.add('halfcastW', ['gesture_01_mirror', 'gesture_02_mirror', 'gesture_03_mirror'], 10, false);
            this.animations.add('halfcastE', ['gesture_01', 'gesture_02', 'gesture_03'], 10, false);
            this.animations.add('dying', ['dying_01', 'dying_02', 'dying_03', 'dying_04', 'dying_05', 'dying_06', 'dying_07', 'dying_08', 'dying_09', 'dying_10'], 10, false);
            this.events.onAnimationComplete.add(this.animationComplete, this);
        }
    }
}
