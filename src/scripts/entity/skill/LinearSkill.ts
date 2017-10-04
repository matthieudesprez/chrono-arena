/// <reference path="BaseSkill.ts"/>
module TacticArena.Entity.Skill {
    export class LinearSkill extends TacticArena.Entity.Skill.BaseSkill {
        paths;

        constructor(state, pawn) {
            super(state, pawn);
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
            this.cleanUI();
        }

        cleanUI() {
            this.state.stageManager.clearHelp();
        }

        updateUI(position) {
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
                this.state.stageManager.showPath(this.paths[pathDirection], this.state.pathTilesGroup, 0xfc000f);
                this.state.uiManager.actionMenu.showCost(this.pawn, 'ap', this.minCost);
            } else {
                this.state.uiManager.actionMenu.showCost(this.pawn, 'ap', 0);
            }
        }

        getPathDirection(position, target) {
            let result = null;
            Object.entries(this.paths).forEach(([direction, path]) => {
                let maxX = null;
                let maxY = null;
                for (var i = 0; i < path.length; i++) {
                    if (path[i].x == target.x && path[i].y == target.y) {
                        result = direction;
                    }
                    if (this.state.stageManager.getNbTilesBetween({'x': path[i].x, 'y': path[i].y}, position) == this.range) {
                        maxX = path[i].x;
                        maxY = path[i].y;
                    }
                }
            });
            return result;
        }

        onOrder(position, direction) {

        }

        order(target) {
            let position = this.pawn.getProjectionOrReal().getPosition();
            if (this.state.stageManager.getNbTilesBetween(target, position) <= this.range) {
                let direction = this.getPathDirection(position, target);
                if (direction) {
                    this.onOrder(position, direction);
                    this.pawn.setAp(this.pawn.getAp() - this.minCost);
                    this.state.signalManager.onActionPlayed.dispatch(this.pawn);
                }
            }
        }
    }
}
