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

        getPosition() {
            return {
                x: this.game.stageManager.layer.getTileX(this.game.input.activePointer.worldX),
                y: this.game.stageManager.layer.getTileY(this.game.input.activePointer.worldY)
            }
        }

        update() {
            let self = this;
            let pointerPosition = this.getPosition();
            this.marker.x = pointerPosition.x * this.game.tileSize;
            this.marker.y = pointerPosition.y * this.game.tileSize;

            let activePawn = this.game.turnManager.getActivePawn();
            let position = activePawn.getProjectionOrReal().getPosition();
            let distance = this.game.stageManager.getNbTilesBetween(
                {'x': pointerPosition.x, 'y': pointerPosition.y}, {'x': position.x, 'y': position.y}
            );
            self.game.pathTilesGroup.removeAll();
            if(this.game.stageManager.canMove(pointerPosition.x, pointerPosition.y) && distance <= activePawn.getAp()) {
                this.game.pathfinder.findPath(
                    position.x,
                    position.y,
                    pointerPosition.x,
                    pointerPosition.y,
                    function (path) {
                        if (path && path.length > 0) {
                            path.shift();
                            self.game.stageManager.showPath(path);
                        }
                    }
                );
                this.game.pathfinder.calculate();
                this.game.stageManager.showPossibleMove(activePawn.getProjectionOrReal().getPosition(), activePawn.getReal().getAp());
            } else {
                this.game.stageManager.clearPossibleMove();
            }
        }

        onGridOver() {
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
