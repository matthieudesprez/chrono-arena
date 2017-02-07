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
                                if (path && path.length > 0) {
                                    path.shift();
                                    self.game.stageManager.showPath(path);
                                }
                            }
                        );
                        this.game.pathfinder.calculate();
                        this.game.stageManager.showPossibleMove(activePawn.getProjectionOrReal().getPosition(), activePawn.getReal().getAp());
                    }
                } else if(self.game.uiManager.actionUI.canOrderFire()) {

                }
            }
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
                } else if (this.game.uiManager.actionUI.canOrderFire()) {
                    let fireball = this.game.add.sprite(position.x * this.game.tileSize, position.y * this.game.tileSize, 'fireball');
                    let fire = fireball.animations.add('fire');
                    let targetX = (position.x - 2) * this.game.tileSize;
                    let targetY = (position.y) * this.game.tileSize;
                    fireball.animations.play('fire', 10, false);
                    var t = this.game.add.tween(
                        fireball).to({x: targetX,y: targetY},
                        1000,
                        Phaser.Easing.Linear.None,
                        true
                    );
                    t.onComplete.add( function(){
                        fireball.kill();
                    }, this);

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
