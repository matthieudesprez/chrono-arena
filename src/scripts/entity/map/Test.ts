/// <reference path="BaseMap.ts"/>
module TacticArena.Map {
    export class Test extends BaseMap {

        constructor() {
            let startPositions = [
                [{x: 4, y: 9, d: 'E'}, {x: 3, y: 8, d: 'E'}],
                [{x: 6, y: 9, d: 'W'}, {x: 8, y: 8, d: 'W'}]
            ];
            super('arena', 'The Pit', startPositions);
        }
    }
}
