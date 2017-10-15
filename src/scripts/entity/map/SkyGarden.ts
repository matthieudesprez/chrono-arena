/// <reference path="BaseMap.ts"/>
module TacticArena.Map {
    export class SkyGarden extends BaseMap {

        constructor() {
            let startPositions = [
                [{x: 4, y: 9, d: 'E'}, {x: 3, y: 10, d: 'E'}],
                [{x: 7, y: 9, d: 'W'}, {x: 8, y: 10, d: 'W'}]
            ];
            super('sky-garden', 'Skyland', startPositions, 0x67AEE4, true);
        }
    }
}
