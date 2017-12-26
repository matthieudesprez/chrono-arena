module TacticArena.Sprite {
    export class LpcSprite extends Sprite.BaseSprite {

        constructor(state, x, y, ext, type, size = 64, tint = null) {
            super(state,  x, y, ext, type, size, tint = null);
            this.anchor.set(0.25, 0.5);
        }

    }
}
