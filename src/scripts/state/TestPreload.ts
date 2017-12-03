module TacticArena.State {
    export class TestPreload extends TacticArena.State.BaseState {

        preload() {
            this.load.onLoadComplete.add(this.loadComplete, this);
            this.load.tilemap('arena', 'assets/maps/arena.json', null, Phaser.Tilemap.TILED_JSON);
            this.load.image('tiles-collection', 'assets/images/maptiles.png');
            this.load.atlasJSONArray('skeleton', 'assets/images/characters/skeleton/spritesheet.png', 'assets/images/characters/skeleton/spritesheet.json');
            this.load.atlasJSONArray('fireball', 'assets/images/fireball.png', 'assets/images/fireball.json');
            this.load.atlasJSONArray('wind', 'assets/images/wind.png', 'assets/images/wind.json');
            this.load.start();
        }

        loadComplete () {
            this.game.state.start('test', true, false, {
                players: [],
                map: Map.Test
            }, null);
        }
    }
}
