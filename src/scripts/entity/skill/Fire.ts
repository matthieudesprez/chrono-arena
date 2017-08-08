module TacticArena.Entity.Skill {
    export class Fire extends TacticArena.Entity.BaseSkill {

        constructor(state, pawn) {
            super(state, pawn);
            this.id = 'fire';
            this.name = 'Fire';
            this.description = 'Cost: 2 AP; Range 4; Hit: 100%';
            this.icon = this.state.make.sprite(0, 0, 'icon-fire');
            this.minCost = 2;
        }

        updateUI(position?) {
            let distance = this.state.stageManager.getNbTilesBetween(position, this.pawn.getProjectionOrReal().getPosition());
            if (distance <= 4) {
                let path = this.state.stageManager.getLinearPath(this.pawn.getProjectionOrReal(), 4);
                this.state.stageManager.showPossibleLinearTrajectories(path);
                let isInPath = false;
                for (var i = 0; i < path.length; i++) {
                    if (path[i].x == position.x && path[i].y == position.y) {
                        isInPath = true;
                    }
                }
                this.state.stageManager.clearPath(this.state.pathTilesGroup);
                if (isInPath) {
                    this.state.stageManager.showPath(path, this.state.pathTilesGroup, 0xfc000f);
                    this.state.uiManager.pawnsinfosUI.showApCost(this.pawn, 2);
                }
            } else {
                this.state.stageManager.clearHelp();
            }
        }
        
        order(target?) {
            let position = this.pawn.getProjectionOrReal().getPosition();
            let distance = this.state.stageManager.getNbTilesBetween(target, this.pawn.getProjectionOrReal().getPosition());
            if (distance <= 4) {
                let path = this.state.stageManager.getLinearPath(this.pawn.getProjectionOrReal(), 4);
                this.state.stageManager.showPossibleLinearTrajectories(path);
                let isInPath = false;
                let maxX = null;
                let maxY = null;
                for(var i = 0; i < path.length; i++) {
                    if(path[i].x == target.x && path[i].y == target.y) {
                        isInPath = true;
                    }
                    if(this.state.stageManager.getNbTilesBetween({'x': path[i].x, 'y': path[i].y}, position) == 4) {
                        maxX = path[i].x;
                        maxY = path[i].y;
                    }
                }
                if(isInPath) {
                    this.pawn.createProjection();
                    this.pawn.getProjectionOrReal().halfcast();
                    this.pawn.setAp(this.pawn.getAp() - 2);
                    this.state.uiManager.pawnsinfosUI.showApCost(this.pawn, 0);
                    this.state.orderManager.add(this.pawn, new Order.Fire(position, this.pawn.getProjectionOrReal().getDirection()));
                    this.state.stageManager.clearHelp();
                    this.state.signalManager.onActionPlayed.dispatch(this.pawn);
                }
            }
        }
    }
}
