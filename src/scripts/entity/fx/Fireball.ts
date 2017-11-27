module TacticArena.FX {
    export class FireBall extends FX.BaseFX {

        constructor(state, position: Position, direction) {
            super(state, 'fireball');
            this.speed = 700;
            this.init(position, direction);
        }
        
        setAnimations() {
            this.animations.add('default', ["fireball_04", "fireball_03", "fireball_02", "fireball_01", "fireball_02", "fireball_03", "fireball_04"], 10, false);
        }
        
        init(position: Position, direction) {
            this.target = new Position(0, 0);
            let scaleX = 1;
            let angle = 0;
            if (direction == 'W' || direction == 'E') {
                this.y = position.y + 40;
                this.target.y = this.y;
                this.x = position.x - 40;
                this.target.x = this.x - 45;
                if (direction == 'E') {
                    this.x = position.x + 110;
                    this.target.x = this.x + 45;
                    scaleX = -1;
                }
            } else if (direction == 'N' || direction == 'S') {
                this.x = position.x + 33;
                this.target.x = this.x;
                this.y = position.y - 40;
                this.target.y = this.y - 45;
                angle = 90;
                if (direction == 'S') {
                    this.y = position.y + 110;
                    this.target.y = this.y + 50;
                    angle = 270;
                }
            }
            this.anchor.setTo(.5, .5);
            this.scale.x *= scaleX;
            this.angle += angle;
        }
    }
}