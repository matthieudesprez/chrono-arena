module TacticArena.Skill {
    export class Walk extends BaseSkill {

        constructor(state, pawn) {
            super(state, pawn);
            this.id = 'walk';
            this.name = 'Walk';
            this.description = 'Cost: 1 AP / tile; Hit: 50%';
            this.minCost = 1;
        }

        onSelect() {
            this.updateUI(this.state.spritesManager.getProjectionOrReal(this.pawn).getPosition());
        }

        onDeselect() {
            this.cleanUI();
        }

        cleanUI() {
            this.state.stageManager.clearHelp();
        }

        updateUI(position:Position) {
            this.state.stageManager.showPossibleMove(this.state.spritesManager.getProjectionOrReal(this.pawn).getPosition(), this.pawn.getAp());
            this.state.stageManager.canMove(this.state.spritesManager.getProjectionOrReal(this.pawn).getPosition(), position.x, position.y, this.pawn.getAp()).then((path) => {
                this.state.stageManager.clearPath(this.state.pathTilesGroup);
                this.state.stageManager.showPath(path, this.state.pathTilesGroup);
                this.state.uiManager.actionMenu.showCost(this.pawn, 'ap', (<any>path).length);
            }, () => {
                this.state.stageManager.clearPath(this.state.pathTilesGroup);
                this.state.uiManager.actionMenu.showCost(this.pawn, 'ap', 0);
            });
        }
        
        order(target) {
            let distance = this.state.stageManager.getNbTilesBetween(target, this.state.spritesManager.getProjectionOrReal(this.pawn).getPosition());
            this.state.stageManager.canMove(this.state.spritesManager.getProjectionOrReal(this.pawn).getPosition(), target.x, target.y, this.pawn.getAp()).then((path) => {
                this.state.process = true;
                let resultPath = path.slice(0); // copy because path is changed during moveTo process
                this.state.spritesManager.getProjectionOrReal(this.pawn, true).moveTo(0, 0, path).then( (res) => {
                    for (var i = 0; i < (resultPath as any).length; i++) {
                        this.state.orderManager.add(this.pawn, new Order.Move(new Position(resultPath[i].x, resultPath[i].y, this.state.spritesManager.getProjectionOrReal(this.pawn).getDirection())));
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
