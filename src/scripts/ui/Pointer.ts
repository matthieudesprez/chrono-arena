module TacticArena.UI {
    export class Pointer {
        game;
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

        clearHelp() {
            let activePawn = this.game.turnManager.getActivePawn();
            this.game.stageManager.clearHelp();
            this.game.uiManager.pawnsinfosUI.showApCost(activePawn, 0);
        }

        update() {
            let self = this;
            let pointerPosition = this.getPosition();
            this.marker.x = pointerPosition.x * this.game.tileSize;
            this.marker.y = pointerPosition.y * this.game.tileSize;

            if(!self.game.process) {
                let activePawn = this.game.turnManager.getActivePawn();
                let position = activePawn.getProjectionOrReal().getPosition();
                let distance = this.game.stageManager.getNbTilesBetween(
                    {'x': pointerPosition.x, 'y': pointerPosition.y}, {'x': position.x, 'y': position.y}
                );
                if(self.game.uiManager.actionUI.canOrderMove()) {
                    this.game.stageManager.canMove(activePawn.getProjectionOrReal(), pointerPosition.x, pointerPosition.y, activePawn.getAp()).then((path) => {
                        this.clearHelp();
                        this.game.stageManager.showPath(path, self.game.pathTilesGroup);
                        this.game.stageManager.showPossibleMove(activePawn.getProjectionOrReal().getPosition(), activePawn.getReal().getAp());
                        this.game.uiManager.pawnsinfosUI.showApCost(activePawn, (<any>path).length);
                    }, (res) => {
                        this.clearHelp();
                    });
                } else if(self.game.uiManager.actionUI.canOrderFire() && activePawn.getAp() >= 2) {
                    if (distance <= 4) {
                        let path = this.game.stageManager.getLinearPath(activePawn.getProjectionOrReal(), 4);
                        this.game.stageManager.showPossibleLinearTrajectories(path);
                        let isInPath = false;
                        for(var i = 0; i < path.length; i++) {
                            if(path[i].x == pointerPosition.x && path[i].y == pointerPosition.y) {
                                isInPath = true;
                            }
                        }
                        this.game.stageManager.clearPath(self.game.pathTilesGroup);
                        if(isInPath) {
                            this.game.stageManager.showPath(path, self.game.pathTilesGroup, 0xfc000f);
                            this.game.uiManager.pawnsinfosUI.showApCost(activePawn, 2);
                        }
                    } else {
                        this.clearHelp();
                    }
                }  else if(self.game.uiManager.actionUI.canOrderWind() && activePawn.getAp() >= 2) {
                    if (distance <= 4) {
                        let path = this.game.stageManager.getLinearPath(activePawn.getProjectionOrReal(), 4);
                        this.game.stageManager.showPossibleLinearTrajectories(path);
                        let isInPath = false;
                        for(var i = 0; i < path.length; i++) {
                            if(path[i].x == pointerPosition.x && path[i].y == pointerPosition.y) {
                                isInPath = true;
                            }
                        }
                        this.game.stageManager.clearPath(self.game.pathTilesGroup);
                        if(isInPath) {
                            this.game.stageManager.showPath(path, self.game.pathTilesGroup, 0xfc000f);
                            this.game.uiManager.pawnsinfosUI.showApCost(activePawn, 2);
                        }
                    } else {
                        this.clearHelp();
                    }
                } else if(self.game.uiManager.actionUI.canOrderSlash() && activePawn.getAp() >= 1) {
                    if (distance <= 2) {
                        let path = this.game.stageManager.getFrontTile(activePawn.getProjectionOrReal());
                        this.game.stageManager.showPossibleLinearTrajectories(path);
                        let isInPath = false;
                        for(var i = 0; i < path.length; i++) {
                            if(path[i].x == pointerPosition.x && path[i].y == pointerPosition.y) {
                                isInPath = true;
                            }
                        }
                        this.game.stageManager.clearPath(self.game.pathTilesGroup);
                        if(isInPath) {
                            this.game.stageManager.showPath(path, self.game.pathTilesGroup, 0xfc000f);
                            this.game.uiManager.pawnsinfosUI.showApCost(activePawn, 1);
                        }
                    } else {
                        this.clearHelp();
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
                    this.game.stageManager.canMove(activePawn.getProjectionOrReal(), targetX, targetY, activePawn.getAp()).then((path) => {
                        self.game.process = true;
                        activePawn.createProjection();
                        let resultPath = JSON.parse(JSON.stringify(path));
                        activePawn.projection.moveTo(0, 0, path).then( (res) => {
                            activePawn.setAp(activePawn.getAp() - distance);
                            for (var i = 0; i < (resultPath as any).length; i++) {
                                console.log(activePawn.getProjectionOrReal().getDirection());
                                self.game.orderManager.add('move', activePawn, resultPath[i].x, resultPath[i].y, activePawn.getProjectionOrReal().getDirection());
                            }
                            self.game.process = false;
                            self.game.signalManager.onActionPlayed.dispatch(activePawn);
                        });
                    }, (res) => {

                    });
                } else if (this.game.uiManager.actionUI.canOrderFire() && activePawn.getAp() >= 2) {
                    if (distance <= 4) {
                        let path = this.game.stageManager.getLinearPath(activePawn.getProjectionOrReal(), 4);
                        this.game.stageManager.showPossibleLinearTrajectories(path);
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
                            this.game.uiManager.pawnsinfosUI.showApCost(activePawn, 0);
                            this.game.orderManager.add('cast', activePawn, position.x, position.y, activePawn.getProjectionOrReal().getDirection());
                            this.clearHelp();
                            self.game.signalManager.onActionPlayed.dispatch(activePawn);
                        }
                    }
                }  else if (this.game.uiManager.actionUI.canOrderWind() && activePawn.getAp() >= 2) {
                    if (distance <= 4) {
                        let path = this.game.stageManager.getLinearPath(activePawn.getProjectionOrReal(), 4);
                        this.game.stageManager.showPossibleLinearTrajectories(path);
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
                            this.game.uiManager.pawnsinfosUI.showApCost(activePawn, 0);
                            this.game.orderManager.add('cast_wind', activePawn, position.x, position.y, activePawn.getProjectionOrReal().getDirection());
                            this.clearHelp();
                            self.game.signalManager.onActionPlayed.dispatch(activePawn);
                        }
                    }
                } else if(self.game.uiManager.actionUI.canOrderSlash() && activePawn.getAp() >= 1) {
                    if (distance <= 1) {
                        let path = this.game.stageManager.getFrontTile(activePawn.getProjectionOrReal());
                        this.game.stageManager.showPossibleLinearTrajectories(path);
                        let isInPath = false;
                        for(var i = 0; i < path.length; i++) {
                            if(path[i].x == targetX && path[i].y == targetY) {
                                isInPath = true;
                            }
                        }
                        if(isInPath) {
                            activePawn.createProjection();
                            activePawn.getProjectionOrReal().getSprite().stand();
                            activePawn.getProjectionOrReal().getSprite().attack();
                            activePawn.setAp(activePawn.getAp() - 1);
                            this.game.uiManager.pawnsinfosUI.showApCost(activePawn, 0);
                            this.game.orderManager.add('slash', activePawn, position.x, position.y, activePawn.getProjectionOrReal().getDirection());
                            this.clearHelp();
                            self.game.signalManager.onActionPlayed.dispatch(activePawn);
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
