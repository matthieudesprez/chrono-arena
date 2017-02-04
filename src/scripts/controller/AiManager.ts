module TacticArena.Controller {
    export class AiManager {
        game;

        constructor(game) {
            this.game = game;
        }

        getClosestPawn(position) {
            //for (var x = 0; x < this.game.stageManager.map.width; x++) {
            //    for (var y = 0; y < this.game.stageManager.map.height; y++) {
            //        tile.alpha = ap > 0 && this.getNbTilesBetween(position, {'x': x, 'y': y}) <= ap ? 0.7 : 1;
            //    }
            //}
            let result = null;
            for (var i = 0; i < this.game.pawns.length; i++) {
                let p = this.game.pawns[i];
                let distance = this.game.stageManager.getNbTilesBetween(position, p.getPosition());
                if(distance > 0) {
                    result = p;
                }
            }
            return result;
        }

        getDirection(p1, p2) {
            if(p1.x > p2.x) {
                return 'W';
            } else if(p1.x < p2.x) {
                return 'E';
            } else if(p1.y > p2.y) {
                return 'N';
            } else if(p1.y < p2.y) {
                return 'S';
            }
        }

        play(pawn) {
            var self = this;
            let p = pawn.getPosition();
            let target = this.getClosestPawn(p);
            if(target) {
                let targetPosition = target.getPosition();
                this.game.orderManager.add('stand_' + this.getDirection(p, targetPosition), pawn, p.x, p.y);
                this.game.pathfinder.findPath(
                    p.x,
                    p.y,
                    targetPosition.x,
                    targetPosition.y,
                    function (path) {
                        if (path && path.length > 0) {
                            path.shift();
                            for (var i = 0; i < (path as any).length; i++) {
                                if(pawn.getAp() > 0) {
                                    self.game.orderManager.add('move', pawn, path[i].x, path[i].y);
                                    self.game.orderManager.add('stand_' + self.getDirection(p, targetPosition), pawn, path[i].x, path[i].y);
                                    pawn.setAp(pawn.getAp() - 1);
                                }
                            }
                        }
                        //self.game.uiManager.endTurn();
                    }
                );
                this.game.pathfinder.calculate();
            }
        }
    }
}
