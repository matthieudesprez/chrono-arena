module TacticArena.UI {
    export class Pointer {
        game;
        marker:Phaser.Graphics;
        cursor_pointer:Phaser.Sprite;

        constructor(game) {
            this.game = game;

            this.marker =  this.game.make.graphics(-1 * this.game.tileSize, -1 * this.game.tileSize);
            this.marker.lineStyle(2, 0xffffff, 1);
            this.marker.drawRect(0, 0, this.game.tileSize, this.game.tileSize);
            this.game.worldGroup.add(this.marker);

            this.game.input.addMoveCallback(this.update, this);
            this.game.input.mousePointer.leftButton.onDown.add(this.onGridLeftClick, this);
            this.game.input.mousePointer.rightButton.onDown.add(this.onGridRightClick, this);
            this.game.input.mouse.capture = true;
            $('canvas').bind('contextmenu', function(e){ return false; });
        }

        getPosition() {
            return {
                x: this.game.stageManager.collisionLayer.getTileX(this.game.input.activePointer.worldX),
                y: this.game.stageManager.collisionLayer.getTileY(this.game.input.activePointer.worldY)
            }
        }

        getTilePosition() {
            return {
                x: this.game.stageManager.collisionLayer.getTileX(this.game.input.activePointer.worldX / this.game.worldGroup.scale.x),
                y: this.game.stageManager.collisionLayer.getTileY(this.game.input.activePointer.worldY / this.game.worldGroup.scale.y)
            }
        }

        getTilePositionFromMarkerPosition() {
            return {
                x: this.marker.x / this.game.tileSize,
                y: this.marker.y / this.game.tileSize
            };
        }

        updateMarker() {
            let p = this.getPosition();
            this.marker.x = Math.round(p.x * this.game.tileSize / this.game.worldGroup.scale.x / 32) * 32;
            this.marker.y = Math.round(p.y * this.game.tileSize / this.game.worldGroup.scale.y / 32) * 32;
        }

        update() {
            if(!this.game.process) {
                this.updateMarker();
                let selectedSkill = this.game.turnManager.getActivePawn().getSelectedSkill();
                if(selectedSkill && selectedSkill.canOrder()) {
                    selectedSkill.updateUI(this.getTilePositionFromMarkerPosition());
                }
            }
        }

        onGridLeftClick() {
            if (!this.game.process) {
                let activePawn = this.game.turnManager.getActivePawn();
                let selectedSkill = activePawn.getSelectedSkill();
                let target = this.getTilePositionFromMarkerPosition();

                if(selectedSkill) {
                    if(selectedSkill.canOrder()) {
                        selectedSkill.order(target);
                    }
                } else {
                    //TODO SELECT CHARACTER
                    console.log(target);
                    //this.game.pawns.forEach( (p, k) => {
                    //    if (self.game.stageManager.equalPositions(p.getPosition(), {x: targetX, y: targetY})) {
                    //        //let actionMenu = new UI.ActionMenu(self.game, p.type);
                    //    }
                    //});
                }
            }
        }

        onGridRightClick() {

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

        destroy () {
            console.log('pointer destroy');
            this.marker.destroy();

            this.game.input.deleteMoveCallback(this.update, this);
            this.game.input.mousePointer.leftButton.onDown.removeAll();
            this.game.input.mousePointer.rightButton.onDown.removeAll();
            this.game.input.mouse.capture = false;

            $('canvas').off('contextmenu');
        }
    }
}
