/// <reference path="Skill.ts"/>
module TacticArena.Skill {
    export class LinearSkill extends TacticArena.Skill.Skill {
        paths;
        pathColor;

        constructor(state, pawn) {
            super(state, pawn);
            this.paths = null;
            this.pathColor = 0xfc000f;
        }

        onSelect() {
            this.paths = this.state.stageManager.getLinearPathsAllDirections(this.state.spritesManager.getProjectionOrReal(this.pawn).getPosition(), this.range);
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
                // TODO create Path class
                for (var i = 0; i < (path as Array<any>).length; i++) {
                    if (path[i].x == position.x && path[i].y == position.y) {
                        isInPath = true;
                        pathDirection = direction;
                    }
                }
            });
            this.state.stageManager.clearPath(this.state.pathTilesGroup);
            if (isInPath) {
                this.state.stageManager.showPath(this.paths[pathDirection], this.state.pathTilesGroup, this.pathColor);
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
                // TODO create Path class
                for (var i = 0; i < (path as Array<any>).length; i++) {
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
            let position = this.state.spritesManager.getProjectionOrReal(this.pawn).getPosition();
            if (this.state.stageManager.getNbTilesBetween(target, position) <= this.range) {
                let direction = this.getPathDirection(position, target);
                if (direction) {
                    this.onOrder(position, direction);
                    this.pawn.setAp(this.pawn.getAp() - this.minCost);
                    this.onDeselect();
                    this.onSelect();
                    this.state.signalManager.onActionPlayed.dispatch(this.pawn);
                }
            }
        }
    }
}
