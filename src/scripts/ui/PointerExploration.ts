module TacticArena.UI {
    export class PointerExploration extends TacticArena.UI.Pointer {
        cursor_attack;
        constructor(game) {
            super(game);
            this.cursor_attack = this.game.add.sprite(this.marker.x + 5, this.marker.y - 5, 'cursor_attack');
            this.cursor_attack.visible = false;
        }

        update() {
            let activePawn = this.game.pawns[0];
            let p = this.getPosition();
            this.marker.x = p.x * this.game.tileSize;
            this.marker.y = p.y * this.game.tileSize;

            if(this.game.stageManager.grid[p.y][p.x] == 0 && !this.game.stageManager.equalPositions(p, activePawn.getPosition())) {
                //console.log('attack');
                //this.marker.visible = false;
                //this.cursor_attack.visible = true;
                //this.cursor_attack.position.x = this.marker.x + 5;
                //this.cursor_attack.position.y = this.marker.y - 5;
                this.marker.lineStyle(2, 0xcd2f36, 1);
            } else {
                this.marker.lineStyle(2, 0xffffff, 1);
                //this.marker.visible = true;
                //this.cursor_attack.visible = false;
            }
            this.marker.drawRect(0, 0, this.game.tileSize, this.game.tileSize);
        }

        onGridLeftClick() {
            let self = this;
            if(!self.game.process) {
                var activePawn = this.game.pawns[0];
                let p = this.getPosition();
                var targetX = this.marker.x / this.game.tileSize;
                var targetY = this.marker.y / this.game.tileSize;
                self.game.process = true;
                console.log(p);
                if(this.game.stageManager.grid[p.y][p.x] != 0) {
                    this.game.stageManager.canMove(activePawn, targetX, targetY).then((path) => {
                        console.log(path);
                        activePawn.moveTo(0, 0, path, true, true).then((res) => {
                            self.game.stageManager.markPawns();
                            self.game.process = false;
                        }, (res) => {

                        });
                    }, (res) => {
                        console.log(res);
                        self.game.process = false;
                    });
                } else if (!this.game.stageManager.equalPositions(p, activePawn.getPosition())){
                    console.log('attack');
                    let enemy = self.game.pawns[1];
                    self.game.process = false;
                    self.game.state.clearCurrentState();
                    self.game.state.start('mainadventurebattle', true, false, {
                        players: [
                            {name: 'Beez', faction: 'animals', player: false, type: enemy.type, spriteClass: enemy.spriteClass, position: enemy.getPosition(), direction: enemy.getDirection()},
                            {name: activePawn._name, faction: 'human', player: true, type: activePawn.type, spriteClass: activePawn.spriteClass, position: activePawn.getPosition(), direction: activePawn.getDirection()}
                        ],
                        stage: self.game.stageManager.getLayers(),
                        center: p
                    });
                }
            }
        }
    }
}
