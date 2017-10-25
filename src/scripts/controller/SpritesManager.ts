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
                pawn.type
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

        destroyAllProjections() {
            this.projections.forEach(projection => {
                projection.kill();
            });
            this.projections = [];
        }

        getReal(pawn) {
            return this.sprites[pawn._id];
        }

        getProjection(pawn) {
            return this.projections[pawn._id];
        }

        getProjectionOrReal(pawn, create=false) {
            let result = null;
            if (this.getProjection(pawn)) {
                result = this.getProjection(pawn);
            } else if (create) {
                result = this.createProjection(pawn);
            } else {
                result = this.getReal(pawn);
            }
            return result;
        }

        hide(pawn) {
            this.getReal(pawn).alpha = 0;
        }

        show(pawn, alpha=1) {
            this.getReal(pawn).alpha = alpha;
        }

        showReal(pawn) {
            if(this.getProjection(pawn)) {
                this.getProjection(pawn).hide();
                this.getReal(pawn).show();
            }
        }

        update() {
            if(this.state.selecting) {
                let activePawn = this.state.turnManager.getActivePawn();
                if(this.getProjection(activePawn)) {
                    if (this.getReal(activePawn).getPosition().equals(this.getProjection(activePawn).getPosition())) {
                        this.getReal(activePawn).hide();
                    } else {
                        this.getReal(activePawn).show();
                    }
                }
            }
        }

    }
}
