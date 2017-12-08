/// <reference path="BaseMap.ts"/>
module TacticArena.Map {
    export class Test extends BaseMap {

        constructor() {
            let startPositions = [
                [new Position(4, 9, 'E'), new Position(3, 8, 'E')],
                [new Position(6, 9, 'W'), new Position(8, 8, 'W')]
            ];
            super('arena', 'The Pit', startPositions);
        }
    }
}
