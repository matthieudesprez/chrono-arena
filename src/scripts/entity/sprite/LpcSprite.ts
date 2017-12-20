module TacticArena.Sprite {
    export class LpcSprite extends Sprite.BaseSprite {

        constructor(state, x, y, ext, type, size = 64, tint = null) {
            super(state,  x - (size / 4), y - (size / 2), ext, type, size = 64, tint = null);
        }

    }
}
