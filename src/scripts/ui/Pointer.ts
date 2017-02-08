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

            this.game.stageManager.clearHelp();

            if(!self.game.process) {
                let activePawn = this.game.turnManager.getActivePawn();
                let position = activePawn.getProjectionOrReal().getPosition();
                let distance = this.game.stageManager.getNbTilesBetween(
                    {'x': pointerPosition.x, 'y': pointerPosition.y}, {'x': position.x, 'y': position.y}
                );
                if(self.game.uiManager.actionUI.canOrderMove()) {
                    if (this.game.stageManager.canMove(pointerPosition.x, pointerPosition.y) && distance <= activePawn.getAp()) {
                        this.game.pathfinder.findPath(
                            position.x,
                            position.y,
                            pointerPosition.x,
                            pointerPosition.y,
                            function (path) {
                                console.log(path);
                                if (path && path.length > 0) {
                                    path.shift();
                                    self.game.stageManager.showPath(path);
                                }
                            }
                        );
                        this.game.pathfinder.calculate();
                        this.game.stageManager.showPossibleMove(activePawn.getProjectionOrReal().getPosition(), activePawn.getReal().getAp());
                    }
                } else if(self.game.uiManager.actionUI.canOrderFire() && activePawn.getAp() >= 2) {
                    if (distance <= 4) {
                        let path = this.game.stageManager.showPossibleLinearTrajectories(activePawn.getProjectionOrReal(), 4);
                        let isInPath = false;
                        for(var i = 0; i < path.length; i++) {
                            if(path[i].x == pointerPosition.x && path[i].y == pointerPosition.y) {
                                isInPath = true;
                            }
                        }
                        if(isInPath) {
                            this.game.stageManager.showPath(path, 0xfc000f);
                        }
                    }
                }
            }
        }

        onGridClick() {
            let self = this;
            if (!this.game.process) {
                var activePawn = this.game.turnManager.getActivePawn();
                var targetX = this.marker.x / this.game.tileSize;
                var targetY = this.marker.y / this.game.tileSize;
                let position = activePawn.getProjectionOrReal().getPosition();
                var distance = this.game.stageManager.getNbTilesBetween(
                    {'x': targetX, 'y': targetY}, {'x': position.x, 'y': position.y}
                );
                if(this.game.uiManager.actionUI.canOrderMove()) {
                    if (this.game.stageManager.canMove(targetX, targetY) && distance <= activePawn.getAp()) {
                        if (targetX != activePawn.getProjectionOrReal().getPosition().x || targetY != activePawn.getProjectionOrReal().getPosition().y) {
                            this.game.process = true;
                            activePawn.createProjection();
                            activePawn.projection.preMoveTo(targetX, targetY).then((path) => {
                                activePawn.setAp(activePawn.getAp() - distance);
                                for (var i = 0; i < (path as any).length; i++) {
                                    this.game.orderManager.add('move', activePawn, path[i].x, path[i].y);
                                }
                                this.game.process = false;
                                this.game.onActionPlayed.dispatch(activePawn.getProjectionOrReal());
                            });
                        }
                    }
                } else if (this.game.uiManager.actionUI.canOrderFire() && activePawn.getAp() >= 2) {
                    if (distance <= 4) {
                        let path = this.game.stageManager.showPossibleLinearTrajectories(activePawn.getProjectionOrReal(), 4);
                        let isInPath = false;
                        let maxX = null;
                        let maxY = null;
                        for(var i = 0; i < path.length; i++) {
                            if(path[i].x == targetX && path[i].y == targetY) {
                                isInPath = true;
                            }
                            if(this.game.stageManager.getNbTilesBetween({'x': path[i].x, 'y': path[i].y}, {'x': position.x, 'y': position.y}) == 4) {
                                maxX = path[i].x;
                                maxY = path[i].y;
                            }
                        }
                        if(isInPath) {
                            activePawn.createProjection();
                            activePawn.getProjectionOrReal().halfcast();
                            activePawn.setAp(activePawn.getAp() - 2);
                            this.game.orderManager.add('cast_' + activePawn.getProjectionOrReal().getDirection(), activePawn, maxX, maxY);
                        }
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
