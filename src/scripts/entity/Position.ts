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

        equals(position:Position):boolean {
            return this.x == position.x && this.y == position.y;
        }

        faces(position:Position, direction):boolean {
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

        getDirectionTo(position: Position) {
            if(this.x > position.x) {
                return 'W';
            } else if(this.x < position.x) {
                return 'E';
            } else if(this.y > position.y) {
                return 'N';
            } else if(this.y < position.y) {
                return 'S';
            }
        }
    }
}
