module TacticArena.UI {
    export class PointerExploration extends TacticArena.UI.Pointer {
        constructor(game) {
            super(game);
        }

        update() {
            let pointerPosition = this.getPosition();
            this.marker.x = pointerPosition.x * this.game.tileSize;
            this.marker.y = pointerPosition.y * this.game.tileSize;
        }

        onGridClick() {
            let self = this;
            if(!self.game.process) {
                var activePawn = this.game.pawns[0];
                var targetX = this.marker.x / this.game.tileSize;
                var targetY = this.marker.y / this.game.tileSize;
                self.game.process = true;
                this.game.stageManager.canMove(activePawn, targetX, targetY).then((path) => {
                    console.log(path);
                    activePawn.moveTo(0, 0, path, true, true).then( (res) => {
                        self.game.process = false;
                    }, (res) => {

                    });
                }, (res) => {
                    console.log(res);
                    self.game.process = false;
                });
            }
        }
    }
}
