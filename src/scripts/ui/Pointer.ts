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
            this.game.input.onDown.add(this.onGridLeftClick, this);
            //this.game.input.onDown.add(this.onGridRightClick, this);
            //this.game.input.pointer1.capture = true;
            //$('canvas').bind('contextmenu', function(e){ return false; });
        }

        getPosition() {
            return this.game.stageManager.getPosition(this.game.input.activePointer.position);
        }

        getTilePosition() {
            return {
                x: this.game.stageManager.collisionLayer.getTileX(this.game.input.activePointer.worldX / this.game.worldGroup.scale.x),
                y: this.game.stageManager.collisionLayer.getTileY(this.game.input.activePointer.worldY / this.game.worldGroup.scale.y)
            }
        }

        getTilePositionFromMarkerPosition():Position {
            return new Position(
                this.marker.x / this.game.tileSize,
                this.marker.y / this.game.tileSize
            );
        }

        updateMarker() {
            this.show();
            let p = this.getPosition();
            this.marker.x = p.x * this.game.tileSize;
            this.marker.y = p.y * this.game.tileSize;
        }

        update() {
            if(!this.game.process && !this.game.uiManager.isOver()) {
                this.updateMarker();
                let selectedSkill = this.game.uiManager.actionMenu.getSelectedSkill();
                let target = this.getTilePositionFromMarkerPosition();
                if(selectedSkill) {
                    if (selectedSkill.canOrder()) {
                        selectedSkill.updateUI(target);
                    } else {
                        selectedSkill.cleanUI();
                    }
                } else {
                    this.game.pawns.forEach( (p, k) => {
                        if (p.getPosition().equals(target)) {
                            console.log(p);
                            //let actionMenu = new UI.ActionMenu(self.game, p.type);
                        }
                    });
                }
            } else {
                this.hide();
            }
        }

        onGridLeftClick() {
            if (!this.game.process && !this.game.uiManager.isOver()) {
                let selectedSkill = this.game.uiManager.actionMenu.getSelectedSkill();
                let target = this.getTilePositionFromMarkerPosition();
                if(selectedSkill) {
                    if(selectedSkill.canOrder()) {
                        selectedSkill.order(target);
                    }
                } else {
                    //TODO SELECT CHARACTER
                    console.log(target);
                    this.game.pawns.forEach( (p, k) => {
                        if (p.getPosition().equals(target)) {
                            console.log(p);
                            //let actionMenu = new UI.ActionMenu(self.game, p.type);
                        }
                    });
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
