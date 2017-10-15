module TacticArena.UI {
    export class Pointer {
        game;
        marker:Phaser.Graphics;
        cursor_pointer:Phaser.Sprite;
        uiLastPosition:Position;

        constructor(game) {
            this.game = game;
            this.uiLastPosition = new Position(-1, -1);
            this.marker =  this.game.make.graphics(-1 * this.game.tileSize, -1 * this.game.tileSize);
            this.marker.lineStyle(2, 0xffffff, 1);
            this.marker.drawRect(0, 0, this.game.tileSize, this.game.tileSize);
            this.game.worldGroup.add(this.marker);

            this.game.input.addMoveCallback(this.update, this);
            this.game.input.onDown.add(this.onGridLeftClick, this);

            document.addEventListener('contextmenu', function(e) {e.preventDefault();});
        }

        getPosition() {
            return this.game.stageManager.getPosition(this.game.input.activePointer.position);
        }

        updateMarker() {
            this.show();
            let p = this.getPosition();
            this.marker.x = p.x * this.game.tileSize;
            this.marker.y = p.y * this.game.tileSize;
        }

        update(pointer, x, y, clicked) {
            if (!this.game.process && !this.game.uiManager.isOver()) {
                let target = this.getPosition();
                if(!this.uiLastPosition.equals(target)) {
                    this.uiLastPosition = target;
                    if (this.game.stageManager.isObstacle(target)) {
                        this.hide();
                    } else {
                        this.updateMarker();
                    }
                    if(this.game.uiManager.actionMenu) {
                        let selectedSkill = this.game.uiManager.actionMenu.getSelectedSkill();
                        if (selectedSkill) {
                            if (selectedSkill.canOrder()) {
                                selectedSkill.updateUI(target);
                            } else {
                                selectedSkill.cleanUI();
                            }
                        }
                    }
                }
            } else {
                this.hide();
            }
        }

        onGridLeftClick() {
            if (!this.game.process && !this.game.uiManager.isOver()) {
                let selectedSkill = this.game.uiManager.actionMenu.getSelectedSkill();
                let target = this.getPosition();
                console.log(target);
                if(selectedSkill) {
                    if(selectedSkill.canOrder()) {
                        selectedSkill.order(target);
                    }
                } else {
                    //TODO SELECT CHARACTER
                    //console.log(target);
                    this.game.pawns.forEach( (p, k) => {
                        if (p.getPosition().equals(target)) {
                            if(p.team == this.game.playerTeam) {
                                this.game.turnManager.setActivePawn(p);
                            } else {
                                this.game.uiManager.actionMenu.clean();
                                this.game.uiManager.actionMenu = new UI.ActionMenu(this.game, p);
                            }
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
            //console.log('pointer destroy');
            this.marker.destroy();

            this.game.input.deleteMoveCallback(this.update, this);
            this.game.input.mousePointer.leftButton.onDown.removeAll();
            this.game.input.mousePointer.rightButton.onDown.removeAll();
            this.game.input.mouse.capture = false;

            //$('canvas').off('contextmenu');
        }
    }
}
