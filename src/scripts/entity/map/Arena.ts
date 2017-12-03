/// <reference path="BaseMap.ts"/>
module TacticArena.Map {
    export class Arena extends BaseMap {

        constructor() {
            let startPositions = [
                [new Position(4, 9, 'E'), new Position(3, 8, 'E'), new Position(3, 10, 'E')],
                [new Position(7, 9, 'W'), new Position(8, 8, 'W'), new Position(8, 10, 'W')]
            ];
            super('arena', 'The Pit', startPositions);
        }
    }
}
