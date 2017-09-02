module TacticArena.Entity.Skill {
    export class Fire extends TacticArena.Entity.BaseSkill {
        paths;

        constructor(state, pawn) {
            super(state, pawn);
            this.id = 'fire';
            this.name = 'Fire';
            this.description = 'Cost: 2 AP; Range 4; Hit: 100%';
            this.icon = this.state.make.sprite(0, 0, 'icon-fire');
            this.minCost = 2;
            this.range = 4;
            this.paths = null;
        }

        onSelect() {
            this.paths = this.state.stageManager.getLinearPathsAllDirections(this.pawn.getProjectionOrReal(), this.range);

            let joinedPaths = [];
            Object.entries(this.paths).forEach(([direction, path]) => {
                joinedPaths = joinedPaths.concat(path);
            });
            this.state.stageManager.showPossibleLinearTrajectories(joinedPaths);
        }

        onDeselect() {
            this.state.stageManager.clearHelp();
        }

        cleanUI() {
            this.state.stageManager.clearHelp();
        }

        updateUI(position?) {
            let isInPath = false;
            let pathDirection = null;
            Object.entries(this.paths).forEach(([direction, path]) => {
                for (var i = 0; i < path.length; i++) {
                    if (path[i].x == position.x && path[i].y == position.y) {
                        isInPath = true;
                        pathDirection = direction;
                    }
                }
            });
            this.state.stageManager.clearPath(this.state.pathTilesGroup);
            if (isInPath) {
                console.log('yeah');
                this.state.stageManager.showPath(this.paths[pathDirection], this.state.pathTilesGroup, 0xfc000f);
                this.state.uiManager.actionMenu.showApCost(this.pawn, 2);
            }
        }
        
        order(target?) {
            let position = this.pawn.getProjectionOrReal().getPosition();
            let distance = this.state.stageManager.getNbTilesBetween(target, this.pawn.getProjectionOrReal().getPosition());
            let isInPath = false;
            let pathDirection = null;
            if (distance <= this.range) {
                Object.entries(this.paths).forEach(([direction, path]) => {
                    //this.state.stageManager.showPossibleLinearTrajectories(path);
                    let maxX = null;
                    let maxY = null;
                    for (var i = 0; i < path.length; i++) {
                        if (path[i].x == target.x && path[i].y == target.y) {
                            isInPath = true;
                            pathDirection = direction;
                        }
                        if (this.state.stageManager.getNbTilesBetween({'x': path[i].x, 'y': path[i].y}, position) == this.range) {
                            maxX = path[i].x;
                            maxY = path[i].y;
                        }
                    }
                });
            }

            if(isInPath) {
                this.pawn.createProjection();
                this.pawn.getProjectionOrReal().faceDirection(pathDirection);
                this.pawn.getProjectionOrReal().halfcast();
                this.pawn.setAp(this.pawn.getAp() - 2);
                this.state.uiManager.actionMenu.showApCost(this.pawn, 0);
                this.state.orderManager.add(this.pawn, new Order.Fire(position, this.pawn.getProjectionOrReal().getDirection()));
                this.state.signalManager.onActionPlayed.dispatch(this.pawn);
            }
        }
    }
}
