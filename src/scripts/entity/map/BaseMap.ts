module TacticArena.Map {
    export class BaseMap {
        name:string;
        label:string;
        backgroundColor:number;
        hasParallaxLayer:Boolean;
        startPositions;

        constructor(name, label, startPositions, backgroundColor=0x000000, hasParallaxLayer=false) {
            this.name = name;
            this.label = label;
            this.startPositions = startPositions;
            this.backgroundColor = backgroundColor;
            this.hasParallaxLayer = hasParallaxLayer;
        }
    }
}