module TacticArena.Controller {
    export class StageManager {
        game;
        map:Phaser.Tilemap;
        backgroundLayer;
        foregroundLayer;
        decorationLayer1;
        decorationLayer2;
        decorationLayer3;
        layer;
        grid;
        initialGrid;

        constructor(game) {
            this.game = game;
            this.map = null;
            this.backgroundLayer = null;
            this.foregroundLayer = null;
            this.decorationLayer1 = null;
            this.decorationLayer2 = null;
            this.decorationLayer3 = null;
            this.layer = null;
            this.grid = [];
            this.initialGrid = [];
        }

        init(name='map') {
            this.map = this.game.add.tilemap(name);
            this.map.addTilesetImage('tiles-collection');
            this.backgroundLayer = this.map.createLayer('Background');
            this.foregroundLayer = this.map.createLayer('Foreground');
            this.layer = this.map.createLayer('Collision');
            this.layer.debug = true;
            this.layer.resizeWorld();
            this.decorationLayer1 = this.map.createLayer('Decorations');
            this.decorationLayer2 = this.map.createLayer('Decorations2');
            this.initGrid();
            this.layer.resizeWorld();
            console.log('jajoute mes tiles', this.backgroundLayer);
        }

        initFromArray(data) {
            this.map = this.game.add.tilemap();
            var objecttileset = this.map.addTilesetImage('tiles-collection', 'tiles-collection', 32, 32, 0, 0, 0);
            console.log(objecttileset);
            //this.backgroundLayer = this.map.createLayer(0);
            //this.backgroundLayer = this.map.createBlankLayer('Background', 30, 30, 32, 32);
            //this.foregroundLayer = this.map.createBlankLayer('Foreground', 30, 30, 32, 32);
            //this.layer = this.map.createBlankLayer('Collision', 30, 30, 32, 32);

            this.backgroundLayer = this.map.create('Background', 30, 30, 32, 32);
            this.foregroundLayer = this.map.createBlankLayer('Foreground', 30, 30, 32, 32);
            this.layer = this.map.createBlankLayer('Collision', 30, 30, 32, 32);
            this.layer.resizeWorld();
            this.decorationLayer1 = this.map.createBlankLayer('Decorations', 30, 30, 32, 32);
            this.decorationLayer2 = this.map.createBlankLayer('Decorations2', 30, 30, 32, 32);

            this.layer.debug = true;
            this.backgroundLayer.debug = true;
            for(var y = 0; y < 30; y++) {
                for(var x = 0; x < 30; x++) {
                    this.map.putTile(-1, x, y, this.layer);
                }
            }
            for(var y = 0; y < 30; y++) {
                for(var x = 0; x < 30; x++) {
                   this.map.putTile(338, x, y, this.backgroundLayer);
                }
            }
            this.map.putTile(338, 0, 0, this.layer);
            this.initGrid();

            this.backgroundLayer.resizeWorld();

            //this.backgroundLayer.dirty = true;
            console.log('oki', this.backgroundLayer, this.grid);
        }

        initGrid() {
            for (var i = 0; i < this.map.layers[2].data.length; i++) {
                this.grid[i] = [];
                for (var j = 0; j < this.map.layers[2].data[i].length; j++) {
                    this.grid[i][j] = this.map.layers[2].data[i][j].index;
                }
            }

            for (var i = 0; i < this.grid.length; i++) {
                this.initialGrid[i] = this.grid[i].slice();
            }

            for (var x = 0; x < this.map.width; x++) {
                for (var y = 0; y < this.map.height; y++) {
                    this.map.removeTile(x, y, 'Collision');
                }
            }
        }

        addDecorations() {
            this.decorationLayer3 = this.map.createLayer('Decorations3');
        }

        isObstacle(x, y) {
            return this.grid[y][x] != -1;
        }

        handleTile(pawn) {
            let p = pawn.getPosition();
            this.grid[p.y][p.x] = pawn.isAlive() ? -1 : 3;
        }

        canMove(entity, x, y, ap=Infinity) {
            return new Promise((resolve, reject) => {
                //this.equalPositions(entity.getPosition(), {x: x, y: y});
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

        getFrontTile(pawn, direction = null, position = null) {
            let p = position ? position : pawn.getPosition();
            let d = direction ? direction : pawn.getDirection();
            let path = [];
            if(d == 'W') { path.push({'x': p.x - 1, 'y': p.y}); }
            else if(d == 'E') { path.push({'x': p.x + 1, 'y': p.y}); }
            else if(d == 'S') { path.push({'x': p.x, 'y': p.y + 1}); }
            else if(d == 'N') { path.push({'x': p.x, 'y': p.y - 1}); }
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
            console.log(coordsA, directionA, coordsB);
            return (
                coordsA.x == coordsB.x && (
                    (coordsA.y == coordsB.y + 1 && directionA == 'N') || (coordsA.y == coordsB.y - 1 && directionA == 'S')
                ) ||
                coordsA.y == coordsB.y && (
                    (coordsA.x == coordsB.x + 1 && directionA == 'W') || (coordsA.x == coordsB.x - 1 && directionA == 'E')
                )
            );
        }

        isFacingAway(coordsA, directionA, coordsB) {
            console.log(coordsA, directionA, coordsB);
            return (
                (coordsA.x == coordsB.x && (directionA == 'N' || directionA == 'S')) ||
                (coordsA.y == coordsB.y && (directionA == 'W' || directionA == 'E'))
            );
        }

        equalPositions(p1, p2) {
            return p1.x == p2.x && p1.y == p2.y;
        }

        markPawns() {
            for (var i = 0; i < this.initialGrid.length; i++) {
                this.grid[i] = this.initialGrid[i].slice();
            }
            for(var i = 0; i < this.game.pawns.length; i++) {
                let p = this.game.pawns[i].getPosition();
                this.grid[p.y][p.x] = 0;
            }
        }
    }
}
