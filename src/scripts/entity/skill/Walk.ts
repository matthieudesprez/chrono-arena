/// <reference path="BaseSkill.ts"/>
module TacticArena.Entity.Skill {
    export class Walk extends TacticArena.Entity.Skill.BaseSkill {

        constructor(state, pawn) {
            super(state, pawn);
            this.id = 'walk';
            this.name = 'Walk';
            this.description = 'Cost: 1 AP / tile; Hit: 50%';
            this.minCost = 1;
        }

        onSelect() {
            this.updateUI(this.pawn.position);
        }

        onDeselect() {
            this.cleanUI();
        }

        cleanUI() {
            this.state.stageManager.clearHelp();
        }

        updateUI(position:Position) {
            this.state.stageManager.showPossibleMove(position, this.pawn.getAp());
            this.state.stageManager.canMove(position, position.x, position.y, this.pawn.getAp()).then((path) => {
                this.state.stageManager.clearPath(this.state.pathTilesGroup);
                this.state.stageManager.showPath(path, this.state.pathTilesGroup);
                this.state.uiManager.actionMenu.showCost(this.pawn, 'ap', (<any>path).length);
            }, () => {
                this.state.stageManager.clearPath(this.state.pathTilesGroup);
                this.state.uiManager.actionMenu.showCost(this.pawn, 'ap', 0);
            });
        }
        
        order(target) {
            let distance = this.state.stageManager.getNbTilesBetween(target, this.pawn.position);
            this.state.stageManager.canMove(this.pawn.position, target.x, target.y, this.pawn.getAp()).then((path) => {
                this.state.process = true;
                let resultPath = path.slice(0); // copy because path is changed during moveTo process
                this.state.spritesManager.createProjection(this.pawn).moveTo(0, 0, path).then( (res) => {
                    for (var i = 0; i < (resultPath as any).length; i++) {
                        // TODO the direction wont be accurate if moveTo(faceDirection==true)
                        this.state.orderManager.add(this.pawn, new Order.Move(resultPath[i], this.pawn.direction));
                    }
                    this.pawn.position = resultPath.slice(-1).pop(); // update the pawn with the targeted position
                    this.pawn.setAp(this.pawn.getAp() - distance * this.minCost);
                    this.state.process = false;
                    this.state.signalManager.onActionPlayed.dispatch(this.pawn);
                    this.cleanUI();
                    this.updateUI(target);
                });
            }, () => {

            });
        }
    }
}
