module TacticArena {
    export class Position {
        x;
        y;
        d;

        constructor(x, y, d?) {
            this.x = x;
            this.y = y;
            this.d = d;
        }

        get() {
            return {
                x: this.x,
                y: this.y,
                d: this.d
            };
        }

        //set(x, y, d) {
        //    this.x = x;
        //    this.y = y;
        //    this.d = d;
        //}

        set(position: Position) {
            if (position.x) {
                this.x = position.x;
            }
            if (position.y) {
                this.y = position.y;
            }
            if (position.d) {
                this.d = position.d;
            }
        }

        setX(x) {
            this.x = x;
        }

        setY(y) {
            this.y = y;
        }

        setD(d) {
            this.d = d;
        }

        moves(direction, distance): void {
            if (direction === 'E') {
                this.setX(this.x + distance);
            } else if (direction === 'W') {
                this.setX(this.x - distance);
            } else if (direction === 'S') {
                this.setY(this.y + distance);
            } else if (direction === 'N') {
                this.setY(this.y - distance);
            }
        }

        /*
         Return 1 if this is farther than the given position when looking in the given direction
         */
        comparePosition(position: Position, direction): number {
            let result = -1;
            if (this.equals(position)) {
                result = 0;
            } else if (
                (direction === 'E' && this.x > position.x) ||
                (direction === 'W' && this.x < position.x) ||
                (direction === 'S' && this.y < position.y) ||
                (direction === 'N' && this.y > position.y)) {
                result = 1;
            }
            return result;
        }

        translate(x, y): Position {
            return new Position(this.x + x, this.y + y, this.d);
        }

        turn(d): Position {
            return new Position(this.x, this.y, d);
        }

        equals(position: Position, withDirection = false): boolean {
            return this.x === position.x && this.y === position.y && (!withDirection || this.d === position.d);
        }

        faces(position: Position): boolean {
            return (
                this.x === position.x && (
                    (this.y === position.y + 1 && this.d === 'N') || (this.y === position.y - 1 && this.d === 'S')
                ) ||
                this.y === position.y && (
                    (this.x === position.x + 1 && this.d === 'W') || (this.x === position.x - 1 && this.d === 'E')
                )
            );
        }

        facesAway(position: Position): boolean {
            return (
                this.x === position.x && (
                    (this.y > position.y && this.d === 'N') || (this.y < position.y && this.d === 'S')
                ) ||
                this.y === position.y && (
                    (this.x > position.x && this.d === 'W') || (this.x < position.x && this.d === 'E')
                )
            );
        }

        isInRange(position: Position, distance: number): boolean {
            return this.facesAway(position) && this.getDistanceFrom(position) <= distance;
        }

        getDistanceFrom(position) {
            return Math.abs(this.x - position.x) + Math.abs(this.y - position.y);
        }

        getDirectionTo(position: Position) {
            if (this.x > position.x) {
                return 'W';
            } else if (this.x < position.x) {
                return 'E';
            } else if (this.y > position.y) {
                return 'N';
            } else if (this.y < position.y) {
                return 'S';
            }
        }

        clone(): Position {
            return new Position(this.x, this.y, this.d);
        }
    }
}
