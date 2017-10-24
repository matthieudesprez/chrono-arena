module TacticArena.UI {
    export class PointerExploration extends TacticArena.UI.Pointer {
        constructor(game) {
            super(game);
        }

        update() {
            if(!this.game.process) {
                let activePawn = this.game.pawns[0];
                let p = this.getPosition();
                this.marker.x = p.x * this.game.game.tileSize;
                this.marker.y = p.y * this.game.game.tileSize;

                if (this.game.stageManager.grid[p.y][p.x] == 0 && !this.game.stageManager.equalPositions(p, activePawn.getPosition())) {
                    this.marker.lineStyle(2, 0xcd2f36, 1);
                } else {
                    this.marker.lineStyle(2, 0xffffff, 1);
                }
                this.marker.drawRect(0, 0, this.game.game.tileSize, this.game.game.tileSize);
            }
        }

        onGridLeftClick() {
            if(!this.game.process) {
                let self = this;
                var activePawn = this.game.pawns[0];
                let p = this.getPosition();
                var targetX = this.marker.x / this.game.game.tileSize;
                var targetY = this.marker.y / this.game.game.tileSize;
                self.game.process = true;
                console.log(p);
                if(this.game.stageManager.grid[p.y][p.x] != 0) {
                    this.game.stageManager.canMove(activePawn.position, targetX, targetY).then((path) => {
                        console.log(path);
                        activePawn.moveTo(0, 0, path, true, true).then((res) => {
                            self.game.stageManager.markPawns();
                            self.game.process = false;
                        }, (res) => {
                            self.game.process = false;
                        });
                    }, (res) => {
                        console.log(res);
                        self.game.process = false;
                    });
                } else if (!this.game.stageManager.equalPositions(p, activePawn.getPosition())){
                    console.log('attack');
                    let enemy = self.game.pawns[1];
                    self.game.process = false;
                    let gridWidth = 10;
                    let gridHeight = 16;
                    let startPosition = {x: p.x - Math.floor(gridWidth / 2), y: p.y - Math.floor(gridHeight / 2)};
                    let layers = self.game.stageManager.getLayers();
                    //self.game.stageManager.fillBlack().then(function() {
                    self.game.state.clearCurrentState();
                    self.game.state.start('mainadventurebattle', true, false, {
                        players: [
                            {name: 'Beez', faction: 'animals', player: false, type: enemy.type, spriteClass: enemy.spriteClass, position: enemy.getPosition(), direction: enemy.getDirection()},
                            {name: activePawn._name, faction: 'human', player: true, type: activePawn.type, spriteClass: activePawn.spriteClass, position: activePawn.getPosition(), direction: activePawn.getDirection()}
                        ],
                        stage: layers,
                        center: p, // {x: startPosition.x - Math.floor(gridWidth / 2), y: startPosition.y - Math.floor(gridHeight / 2)},
                        gridWidth: gridWidth,
                        gridHeight: gridHeight,
                        startPosition : startPosition
                    });
                    //});
                } else {
                    self.game.process = false;
                }
            }
        }
    }
}
