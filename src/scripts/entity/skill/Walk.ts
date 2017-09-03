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
            this.updateUI(this.pawn.getProjectionOrReal().getPosition());
        }

        onDeselect() {
            this.cleanUI();
        }

        cleanUI() {
            this.state.stageManager.clearHelp();
        }

        updateUI(position) {
            this.state.stageManager.showPossibleMove(this.pawn.getProjectionOrReal().getPosition(), this.pawn.getReal().getAp());
            this.state.stageManager.canMove(this.pawn.getProjectionOrReal(), position.x, position.y, this.pawn.getAp()).then((path) => {
                this.state.stageManager.clearPath(this.state.pathTilesGroup);
                this.state.stageManager.showPath(path, this.state.pathTilesGroup);
                this.state.uiManager.actionMenu.showApCost(this.pawn, (<any>path).length);
            }, () => {
                this.state.stageManager.clearPath(this.state.pathTilesGroup);
                this.state.uiManager.actionMenu.showApCost(this.pawn, 0);
            });
        }
        
        order(target) {
            let distance = this.state.stageManager.getNbTilesBetween(target, this.pawn.getProjectionOrReal().getPosition());
            this.state.stageManager.canMove(this.pawn.getProjectionOrReal(), target.x, target.y, this.pawn.getAp()).then((path) => {
                this.state.process = true;
                let resultPath = path.slice(0);
                this.pawn.createProjection();
                this.pawn.projection.moveTo(0, 0, path).then( (res) => {
                    for (var i = 0; i < (resultPath as any).length; i++) {
                        let order = new Order.Move(new Position(resultPath[i].x, resultPath[i].y), this.pawn.getProjectionOrReal().getDirection());
                        this.state.orderManager.add(this.pawn, order);
                    }
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
