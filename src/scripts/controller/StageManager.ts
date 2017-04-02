module TacticArena.Controller {
    export class StageManager {
        game;
        map:Phaser.Tilemap;
        layer;
        grid;

        constructor(game) {
            this.game = game;
            this.map = null;
            this.layer = null;
            this.grid = [];
        }

        init() {
            this.map = this.game.add.tilemap('map');
            this.map.addTilesetImage('tiles-collection');
            this.map.createLayer('Background');
            this.layer = this.map.createLayer('Foreground');
            this.map.createLayer('Decorations');
            this.map.createLayer('Decorations2');
            for (var i = 0; i < this.map.layers[2].data.length; i++) {
                this.grid[i] = [];
                for (var j = 0; j < this.map.layers[2].data[i].length; j++) {
                    this.grid[i][j] = this.map.layers[2].data[i][j].index;
                }
            }
        }

        addDecorations() {
            this.map.createLayer('Decorations3');
        }

        handleTile(pawn) {
            let p = pawn.getPosition();
            this.grid[p.y][p.x] = pawn.isAlive() ? -1 : 3;
        }

        canMove(entity, x, y, ap) {
            return new Promise((resolve, reject) => {
                this.equalPositions(entity.getPosition(), {x: x, y: y});
                this.game.pathfinder.findPath(entity.getPosition().x, entity.getPosition().y, x, y, function (path) {
                    if (path && path.length > 0) {
                        path.shift();
                        if (path.length > ap) {
                            reject(path);
                        } else {
                            resolve(path);
                        }
                    } else {
                        reject(path);
                    }
                });
                this.game.pathfinder.calculate();
            });
        }

        getLinearPath(pawn, distance, direction = null, position = null) {
            let p = position ? position : pawn.getPosition();
            let d = direction ? direction : pawn.getDirection();
            let path = [];
            for (var x = 0; x < this.map.width; x++) {
                for (var y = 0; y < this.map.height; y++) {
                    if (
                        (d == 'W' && p.x > x && p.y == y ||
                        d == 'E' && p.x < x && p.y == y ||
                        d == 'N' && p.x == x && p.y > y ||
                        d == 'S' && p.x == x && p.y < y) &&
                        this.getNbTilesBetween(p, {'x': x, 'y': y}) <= distance
                    ) {
                        path.push({'x': x, 'y': y});
                    }
                }
            }
            return path;
        }

        showPossibleLinearTrajectories(path) {
            this.clearPossibleMove();
            for (var i = 0; i < path.length; i++) {
                let tile = this.map.getTile(path[i].x, path[i].y, this.map.layer[0], true);
                tile.alpha = 0.7;
            }
            this.map.layers[0].dirty = true;
        }

        showPossibleMove(position, ap) {
            for (var x = 0; x < this.map.width; x++) {
                for (var y = 0; y < this.map.height; y++) {
                    let tile = this.map.getTile(x, y, this.map.layer[0], true);
                    tile.alpha = ap > 0 && this.getNbTilesBetween(position, {'x': x, 'y': y}) <= ap ? 0.7 : 1;
                }
            }
            this.map.layers[0].dirty = true;
        }

        clearPossibleMove() {
            for (var x = 0; x < this.map.width; x++) {
                for (var y = 0; y < this.map.height; y++) {
                    let tile = this.map.getTile(x, y, this.map.layer[0], true);
                    tile.alpha = 1;
                }
            }
            this.map.layers[0].dirty = true;
        }

        showPath(path, group, tint = null) {
            for (var i = 0; i < (path as any).length; i++) {
                let tile = this.map.getTile(path[i].x, path[i].y, this.map.layer[0], true);
                let tileSprite = new Phaser.Sprite(this.game, tile.x * this.game.tileSize, tile.y * this.game.tileSize, 'path-tile', '');
                if (tint) {
                    tileSprite.tint = tint;
                }
                group.add(tileSprite);
            }
        }


        clearPath(group) {
            group.removeAll();
        }

        clearHelp() {
            this.clearPossibleMove();
            this.clearPath(this.game.pathTilesGroup);
        }

        getNbTilesBetween(coordsA, coordsB) {
            return Math.abs(coordsA.x - coordsB.x) + Math.abs(coordsA.y - coordsB.y);
        }

        isFacing(coordsA, directionA, coordsB) {
            return (
                coordsA.x == coordsB.x && (
                    (coordsA.y == coordsB.y + 1 && directionA == 'N') || (coordsA.y == coordsB.y - 1 && directionA == 'S')
                ) ||
                coordsA.y == coordsB.y && (
                    (coordsA.x == coordsB.x + 1 && directionA == 'W') || (coordsA.x == coordsB.x - 1 && directionA == 'E')
                )
            );
        }

        equalPositions(p1, p2) {
            return p1.x == p2.x && p1.y == p2.y;
        }
    }
}
