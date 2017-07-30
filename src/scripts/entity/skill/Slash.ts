module TacticArena.Entity.Skill {
    export class Slash extends TacticArena.Entity.BaseSkill {

        constructor(state, pawn) {
            super(state, pawn);
            this.id = 'slash';
            this.name = 'Slash';
            this.description = 'Cost: 1 AP; Range 1; Hit: 100%';
            this.icon = this.state.make.sprite(0, 0, 'icon-slash');
            this.minCost = 1;
        }

        updateUI(position?) {
            let distance = this.state.stageManager.getNbTilesBetween(position, this.pawn.getProjectionOrReal().getPosition());
            if (distance <= 2) {
                let path = this.state.stageManager.getFrontTile(this.pawn.getProjectionOrReal());
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
                    this.state.uiManager.pawnsinfosUI.showApCost(this.pawn, 1);
                }
            } else {
                this.state.stageManager.clearHelp();
            }
        }
        
        order(target?) {
            let position = this.pawn.getProjectionOrReal().getPosition();
            let distance = this.state.stageManager.getNbTilesBetween(target, this.pawn.getProjectionOrReal().getPosition());
            if (distance <= 1) {
                let path = this.state.stageManager.getFrontTile(this.pawn.getProjectionOrReal());
                this.state.stageManager.showPossibleLinearTrajectories(path);
                let isInPath = false;
                for(var i = 0; i < path.length; i++) {
                    if(path[i].x == target.x && path[i].y == target.y) {
                        isInPath = true;
                    }
                }
                if(isInPath) {
                    this.pawn.createProjection();
                    this.pawn.getProjectionOrReal().getSprite().stand();
                    this.pawn.getProjectionOrReal().getSprite().attack();
                    this.pawn.setAp(this.pawn.getAp() - 1);
                    this.state.uiManager.this.pawnsinfosUI.showApCost(this.pawn, 0);
                    this.state.orderManager.add('slash', this.pawn, position.x, position.y, this.pawn.getProjectionOrReal().getDirection());
                    this.state.stageManager.clearHelp();
                    this.state.signalManager.onActionPlayed.dispatch(this.pawn);
                }
            }
        }
    }
}
