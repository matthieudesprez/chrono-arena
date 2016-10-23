module TacticArena.UI {
    export class Pointer {
        game:State.Main;
        marker:Phaser.Graphics;

        constructor(game) {
            this.game = game;

            this.marker = this.game.add.graphics(-this.game.tileSize, -this.game.tileSize);
            this.marker.lineStyle(2, 0xffffff, 1);
            this.marker.drawRect(0, 0, this.game.tileSize, this.game.tileSize);

            this.game.input.addMoveCallback(this.update, this);
            this.game.input.onDown.add(this.onGridClick, this);
        }

        update() {      
            this.marker.x = this.game.stageManager.layer.getTileX(this.game.input.activePointer.worldX) * this.game.tileSize;
            this.marker.y = this.game.stageManager.layer.getTileY(this.game.input.activePointer.worldY) * this.game.tileSize;
        }

        onGridClick() {
            if (!this.game.process) {
                var activePawn = this.game.turnManager.getActivePawn();
                var targetX = this.marker.x / this.game.tileSize;
                var targetY = this.marker.y / this.game.tileSize;
                if(targetX != activePawn.getPosition().x || targetY != activePawn.getPosition().y) {
                    this.game.process = true;
                    activePawn.createGhost();
                    activePawn.preMoveTo(targetX, targetY).then((res) => {
                        this.game.orderManager.add('move', activePawn, targetX, targetY);
                        this.game.process = false;
                    });
                }
            }
        }

        hide() {
            this.marker.visible = false;
        }

        show() {
            this.marker.x = -this.game.tileSize;
            this.marker.y = -this.game.tileSize;
            this.marker.visible = true;
        }

        dealWith(element) {
            var self = this;
            element.addEventListener('mouseover', function() {
                self.hide();
            });
            element.addEventListener('mouseout', function() {
                self.show();
            });
            
        }
    }
}
