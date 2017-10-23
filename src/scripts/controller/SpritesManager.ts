module TacticArena {
    export class SpritesManager {
        state;
        sprites;
        projections;

        constructor(state) {
            this.state = state;
            this.sprites = {};
            this.projections = {};
        }

        getSprite(pawn) {
            return new pawn.spriteClass(
                this.state,
                this.state.game.tileSize * pawn.position.x - (64 / 4),
                this.state.game.tileSize * pawn.position.y - (64 / 2),
                pawn.direction,
                pawn.type,
                pawn,
                64
            );
        }

        add(pawn, container=this.sprites) {
            let sprite = this.getSprite(pawn);
            container[pawn._id] = sprite;
            if(this.state.pawnsSpritesGroup) {
                this.state.pawnsSpritesGroup.add(sprite);
            }
            return sprite;
        }

        createProjection(pawn) {
            if (!this.projections[pawn._id]) {
                let sprite = this.add(pawn, this.projections);
                sprite.alpha = 0.7;
            }
            return this.projections[pawn._id];
        }

        destroyProjection(pawn) {
            if (this.projections[pawn._id]) {
                this.projections[pawn._id].kill();
                delete this.projections[pawn._id];
            }
        }

        getProjectionOrReal(pawn, create=false) {
            let result = null;
            if (this.projections[pawn._id]) {
                result = this.projections[pawn._id];
            } else if (create) {
                result = this.createProjection(pawn);
            } else {
                result = this.sprites[pawn._id];
            }
            return result;
        }

        hide(pawn) {
            this.sprites[pawn._id].alpha = 0;
        }

        show(pawn, alpha=1) {
            this.sprites[pawn._id].alpha = alpha;
        }

    }
}
