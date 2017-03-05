module TacticArena.Controller {
    export class AiManager {
        game;

        constructor(game) {
            this.game = game;
        }

        getClosestPawn(position) {
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

                let direction = self.getDirection(p, targetPosition);
                if(pawn.getDirection() != direction) {
                    this.game.orderManager.add('stand_' + direction, pawn, p.x, p.y, direction);
                    pawn.setAp(pawn.getAp() - 1);
                }

                let lastDirection = pawn.getDirection();
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
                                    pawn.setAp(pawn.getAp() - 1);

                                    direction = self.getDirection(p, targetPosition);
                                    if(lastDirection != direction || i >= path.length - 1) {
                                        lastDirection = direction;
                                        self.game.orderManager.add('stand_' + direction, pawn, path[i].x, path[i].y, direction);
                                        pawn.setAp(pawn.getAp() - 1);
                                    }
                                }
                            }
                        }
                        //self.game.uiManager.endOrderPhase();
                    }
                );
                this.game.pathfinder.calculate();
            }
        }
    }
}
