/// <reference path="BaseMap.ts"/>
module TacticArena.Map {
    export class Arena extends BaseMap {

        constructor() {
            let startPositions = [
                [{x: 4, y: 9, d: 'E'}, {x: 3, y: 8, d: 'E'}],
                [{x: 7, y: 9, d: 'W'}, {x: 8, y: 8, d: 'W'}]
            ];
            super('arena', 'The Pit', startPositions);
        }
    }
}
