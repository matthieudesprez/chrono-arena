/// <reference path="BaseMap.ts"/>
module TacticArena.Map {
    export class Volcano extends BaseMap {

        constructor() {
            let startPositions = [
                [new Position(4, 9, 'E'), new Position(3, 10, 'E'), new Position(3, 9, 'E')],
                [new Position(7, 9, 'W'), new Position(8, 10, 'W'), new Position(8, 9, 'W')]
            ];
            super('volcano', 'Volcano', startPositions);
        }
    }
}
