module TacticArena {
    export class Position {
        x;
        y;

        constructor(x, y) {
            this.x = x;
            this.y = y;
        }

        get() {
            return {
                x: this.x,
                y: this.y
            };
        }

        set(x, y) {
            this.x = x;
            this.y = y;
        }

        setX(x) {
            this.x = x;
        }

        setY(y) {
            this.y = y;
        }

        equals(position:Position):Boolean {
            return this.x == position.x && this.y == position.y;
        }

        faces(position:Position, direction):Boolean {
            return (
                this.x == position.x && (
                    (this.y == position.y + 1 && direction == 'N') || (this.y == position.y - 1 && direction == 'S')
                ) ||
                this.y == position.y && (
                    (this.x == position.x + 1 && direction == 'W') || (this.x == position.x - 1 && direction == 'E')
                )
            );
        }

        getDistanceFrom(position) {
            return Math.abs(this.x - position.x) + Math.abs(this.y - position.y);
        }
    }
}
