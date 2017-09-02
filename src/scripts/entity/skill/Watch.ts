module TacticArena.Entity.Skill {
    export class Watch extends TacticArena.Entity.BaseSkill {

        constructor(state, pawn) {
            super(state, pawn);
            this.id = 'watch';
            this.name = 'Watch';
            this.description = 'Cost: 1 AP / tile; Hit: 50%';
            this.icon = this.state.make.sprite(0, 0, 'icon-wait');
            this.minCost = 1;
        }

        //updateUI(position?) {
        //    this.state.stageManager.canMove(this.pawn.getProjectionOrReal(), position.x, position.y, this.pawn.getAp()).then((path) => {
        //        this.state.stageManager.clearHelp();
        //        this.state.stageManager.showPath(path, this.state.pathTilesGroup);
        //        this.state.stageManager.showPossibleMove(this.pawn.getProjectionOrReal().getPosition(), this.pawn.getReal().getAp());
        //        this.state.uiManager.actionMenu.showApCost(this.pawn, (<any>path).length);
        //    }, (res) => {
        //        this.state.stageManager.clearHelp();
        //        this.state.uiManager.actionMenu.showApCost(this.pawn, 0);
        //    });
        //}
        //
        //order() {
        //    let position = this.pawn.getProjectionOrReal().getPosition();
        //    this.state.orderManager.add('stand', this.pawn, position.x, position.y, this.pawn.getProjectionOrReal().getDirection());
        //    this.pawn.setAp(this.pawn.getAp() - 1);
        //    this.state.signalManager.onActionPlayed.dispatch(this.pawn);
        //}
    }
}
