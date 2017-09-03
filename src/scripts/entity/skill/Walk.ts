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

        updateUI(position) {
            this.state.stageManager.canMove(this.pawn.getProjectionOrReal(), position.x, position.y, this.pawn.getAp()).then((path) => {
                this.state.stageManager.clearHelp();
                this.state.stageManager.showPath(path, this.state.pathTilesGroup);
                this.state.stageManager.showPossibleMove(this.pawn.getProjectionOrReal().getPosition(), this.pawn.getReal().getAp());
                this.state.uiManager.actionMenu.showApCost(this.pawn, (<any>path).length);
            }, (res) => {
                this.state.stageManager.clearHelp();
                this.state.uiManager.actionMenu.showApCost(this.pawn, 0);
            });
        }
        
        order(target) {
            console.log(this.pawn);
            let distance = this.state.stageManager.getNbTilesBetween(target, this.pawn.getProjectionOrReal().getPosition());
            this.state.stageManager.canMove(this.pawn.getProjectionOrReal(), target.x, target.y, this.pawn.getAp()).then((path) => {
                this.state.process = true;
                this.pawn.createProjection();
                let resultPath = JSON.parse(JSON.stringify(path));
                this.pawn.projection.moveTo(0, 0, path).then( (res) => {
                    this.pawn.setAp(this.pawn.getAp() - distance);
                    for (var i = 0; i < (resultPath as any).length; i++) {
                        let order = new Order.Move(new Position(resultPath[i].x, resultPath[i].y), this.pawn.getProjectionOrReal().getDirection());
                        this.state.orderManager.add(this.pawn, order);
                    }
                    this.state.process = false;
                    this.state.signalManager.onActionPlayed.dispatch(this.pawn);
                    this.state.stageManager.clearHelp();
                });
            }, (res) => {

            });
        }
    }
}
