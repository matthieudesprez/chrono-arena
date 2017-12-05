module TacticArena {
    export class AiManager {
        game;
        team;

        constructor(game, team) {
            this.game = game;
            this.team = team;
        }

        getClosestPawn(position, enemy=true) {
            let result = null;
            let min_distance = Infinity;
            for (var i = 0; i < this.game.pawns.length; i++) {
                let p = this.game.pawns[i];
                let distance = this.game.stageManager.getNbTilesBetween(position, p.getPosition());
                if(distance > 0 && distance < min_distance && ((p.team != this.team && p.isAlive()) || !enemy)) {
                    result = p;
                    min_distance = distance;
                }
            }
            return result;
        }

        play(pawn) {
            var self = this;
            let p = this.game.spritesManager.getReal(pawn).getPosition();
            let target = this.getClosestPawn(p);
            if(target) {
                let targetPosition = this.game.spritesManager.getReal(target).getPosition();
                let direction = p.getDirectionTo(targetPosition);
                if(pawn.getDirection() != direction) {
                    this.game.orderManager.add(pawn, new Order.Stand(new Position(p.x, p.y, direction)));
                    pawn.setAp(pawn.getAp() - 1, false);
                }
                if(self.game.stageManager.isFacingAway(p, pawn.getDirection(), targetPosition)) {
                    this.game.orderManager.add(pawn, new Order.Fire(new Position(p.x, p.y, pawn.getDirection())));
                    pawn.setAp(pawn.getAp() - 2, false);
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
                                    direction = p.getDirectionTo(targetPosition);
                                    self.game.orderManager.add(pawn, new Order.Move(new Position(path[i].x, path[i].y), direction));
                                    pawn.setAp(pawn.getAp() - 1, false);

                                    if(lastDirection != direction || i >= path.length - 1) {
                                        lastDirection = direction;
                                        self.game.orderManager.add(pawn, new Order.Stand(new Position(path[i].x, path[i].y), direction));
                                        pawn.setAp(pawn.getAp() - 1, false);
                                    }
                                }
                            }
                        }
                        if(!self.game.debugMode) {
                            Action.ConfirmOrder.process(self.game);
                        }
                    }
                );
                this.game.pathfinder.calculate();
            }
        }
    }
}
