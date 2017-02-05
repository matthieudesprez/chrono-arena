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
                let position = activePawn.getProjectionOrReal().getPosition();
                var distance = this.game.stageManager.getNbTilesBetween(
                    {'x': targetX, 'y': targetY}, {'x': position.x, 'y': position.y}
                );
                if(this.game.stageManager.canMove(targetX, targetY) && distance <= activePawn.getAp()) {
                    if(targetX != activePawn.getPosition().x || targetY != activePawn.getPosition().y) {
                        this.game.process = true;
                        activePawn.createProjection();
                        activePawn.projection.preMoveTo(targetX, targetY).then((path) => {
                            activePawn.setAp(activePawn.getAp() - distance);
                            for(var i = 0; i < (path as any).length; i++) {
                                this.game.orderManager.add('move', activePawn, path[i].x, path[i].y);
                            }
                            this.game.onActionPlayed.dispatch(activePawn);
                            this.game.process = false;
                        });
                    }
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
            element.on('mouseover', function() {
                self.hide();
            });
            element.on('mouseout', function() {
                self.show();
            });
        }
    }
}
