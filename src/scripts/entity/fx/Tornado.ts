module TacticArena.FX {
    export class Tornado extends FX.BaseFX {

        constructor(state, position: Position, direction) {
            super(state, 'wind');
            this.speed = 1000;
            this.init(position, direction);
        }
        
        setAnimations() {
            this.animations.add('default', ["wind_01", "wind_02", "wind_03", "wind_04", "wind_05", "wind_06", "wind_07"], 7, false);
        }
        
        init(position: Position, direction) {
            this.target = new Position(0, 0);
            let scaleX = 1;
            if (direction == 'W' || direction == 'E') {
                this.y = position.y + 40;
                this.target.y = this.y;
                this.x = position.x;
                this.target.x = this.x - 100;
                if (direction == 'E') {
                    this.x = position.x + 65;
                    this.target.x = this.x + 100;
                    scaleX = -1;
                }
            } else if (direction == 'N' || direction == 'S') {
                this.x = position.x + 30;
                this.target.x = this.x;
                this.y = position.y + 5;
                this.target.y = this.y - 110;
                if (direction == 'S') {
                    this.y = position.y + 65;
                    this.target.y = this.y + 110;
                }
            }
            this.anchor.setTo(.5, .5);
            this.scale.x *= scaleX;
        }
    }
}