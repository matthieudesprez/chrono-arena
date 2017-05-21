module TacticArena.Controller {
    export class StageManager {
        game;
        map:Phaser.Tilemap;
        parallaxLayer;
        backgroundLayer;
        foregroundLayer;
        collisionLayer;
        decorationLayer1;
        decorationLayer2;
        decorationLayer3;
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
            this.collisionLayer = null;
            this.grid = [];
            this.initialGrid = [];
        }

        init(name = 'map') {
            this.map = this.game.add.tilemap(name);
            this.map.addTilesetImage('tiles-collection', 'tiles-collection', this.game.tileSize, this.game.tileSize, 0, 0);
            this.map.addTilesetImage('CloudPurple', 'CloudPurple', this.game.tileSize, this.game.tileSize, 0, 0);
            this.parallaxLayer = this.map.createLayer('Parallax');
            this.parallaxLayer.scrollFactorX = 0.5;
            this.parallaxLayer.scrollFactorY = 0.5;
            this.backgroundLayer = this.map.createLayer('Background');
            this.foregroundLayer = this.map.createLayer('Foreground');
            this.collisionLayer = this.map.createLayer('Collision');
            //this.collisionLayer.debug = true;
            this.decorationLayer1 = this.map.createLayer('Decorations');
            this.decorationLayer2 = this.map.createLayer('Decorations2');
            this.initGrid();
            this.backgroundLayer.resizeWorld();
            console.log('jajoute mes tiles', this.grid.length, this.backgroundLayer.layer.data.length);
        }

        initFromArray(data, width=160, height=160, start={x:0, y:0}) {
            this.map = this.game.add.tilemap();
            //this.map.addTilesetImage('CloudPurple', 'CloudPurple', this.game.tileSize, this.game.tileSize, 0, 0, 1);
            //
            //this.parallaxLayer = this.map.create('Parallax', 160, 160, this.game.tileSize, this.game.tileSize);
            //this.parallaxLayer.scrollFactorX = 0.5;
            //this.parallaxLayer.scrollFactorY = 0.5;
            //this.map.paste(0, 0, data.background.map.copy(0, 0, 160, 160, data.parallax), this.parallaxLayer);

            this.map.addTilesetImage('tiles-collection', 'tiles-collection', this.game.tileSize, this.game.tileSize, 0, 0, 1);
            this.backgroundLayer = this.map.create('Background', width, height, this.game.tileSize, this.game.tileSize);
            this.foregroundLayer = this.map.createBlankLayer('Foreground', width, height, this.game.tileSize, this.game.tileSize);
            this.collisionLayer = this.map.createBlankLayer('Collision', width, height, this.game.tileSize, this.game.tileSize);
            this.decorationLayer1 = this.map.createBlankLayer('Decorations', width, height, this.game.tileSize, this.game.tileSize);
            this.decorationLayer2 = this.map.createBlankLayer('Decorations2', width, height, this.game.tileSize, this.game.tileSize);

            console.log(start);
            this.map.paste(0, 0, data.background.map.copy(start.x, start.y, width, height, data.background), this.backgroundLayer);
            this.map.paste(0, 0, data.background.map.copy(start.x, start.y, width, height, data.foreground), this.foregroundLayer);
            this.map.paste(0, 0, data.background.map.copy(start.x, start.y, width, height, data.collision), this.collisionLayer);
            this.map.paste(0, 0, data.background.map.copy(start.x, start.y, width, height, data.decoration1), this.decorationLayer1);
            this.map.paste(0, 0, data.background.map.copy(start.x, start.y, width, height, data.decoration2), this.decorationLayer2);

            //for (var i = 0; i < data.background.layer.data.length; i++) {
            //    for (var j = 0; j < data.background.layer.data[i].length; j++) {
            //        console.log(data.background.layer.data[i][j]);
            //        this.map.putTile(data.background.layer.data[i][j].index, j, i, this.backgroundLayer);
            //    }
            //}
            this.initGrid();
            this.backgroundLayer.resizeWorld();
        }

        initGrid() {
            for (var i = 0; i < this.collisionLayer.layer.data.length; i++) {
                this.grid[i] = [];
                for (var j = 0; j < this.collisionLayer.layer.data[i].length; j++) {
                    this.grid[i][j] = this.collisionLayer.layer.data[i][j].index;
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

        addDecorationsFromData(data, width=160, height=160, start={x:0, y:0}) {
            this.decorationLayer3 = this.map.createBlankLayer('Decorations3', width, height, this.game.tileSize, this.game.tileSize);
            this.map.paste(0, 0, data.background.map.copy(start.x, start.y, width, height, data.decoration3), this.decorationLayer3);
        }

        getLayers() {
            return {
                parallax: this.parallaxLayer,
                background: this.backgroundLayer,
                foreground: this.foregroundLayer,
                collision: this.collisionLayer,
                decoration1: this.decorationLayer1,
                decoration2: this.decorationLayer2,
                decoration3: this.decorationLayer3
            };
        }

        isObstacle(x, y) {
            return this.grid[y][x] != -1;
        }

        handleTile(pawn) {
            let p = pawn.getPosition();
            this.grid[p.y][p.x] = pawn.isAlive() ? -1 : 3;
        }

        canMove(entity, x, y, ap = Infinity) {
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
            if (d == 'W') {
                path.push({'x': p.x - 1, 'y': p.y});
            }
            else if (d == 'E') {
                path.push({'x': p.x + 1, 'y': p.y});
            }
            else if (d == 'S') {
                path.push({'x': p.x, 'y': p.y + 1});
            }
            else if (d == 'N') {
                path.push({'x': p.x, 'y': p.y - 1});
            }
            return path;
        }

        showPossibleLinearTrajectories(path) {
            this.clearPossibleMove();
            for (var i = 0; i < path.length; i++) {
                let tile = this.map.getTile(path[i].x, path[i].y, this.backgroundLayer, true);
                tile.alpha = 0.7;
            }
            this.backgroundLayer.layer.dirty = true;
        }

        showPossibleMove(position, ap) {
            for (var x = 0; x < this.map.width; x++) {
                for (var y = 0; y < this.map.height; y++) {
                    let tile = this.map.getTile(x, y, this.backgroundLayer, true);
                    tile.alpha = ap > 0 && this.getNbTilesBetween(position, {'x': x, 'y': y}) <= ap ? 0.7 : 1;
                }
            }
            this.backgroundLayer.layer.dirty = true;
        }

        clearPossibleMove() {
            for (var x = 0; x < this.map.width; x++) {
                for (var y = 0; y < this.map.height; y++) {
                    let tile = this.map.getTile(x, y, this.backgroundLayer, true);
                    tile.alpha = 1;
                }
            }
            this.backgroundLayer.layer.dirty = true;
        }

        showPath(path, group, tint = null) {
            for (var i = 0; i < (path as any).length; i++) {
                let tile = this.map.getTile(path[i].x, path[i].y, this.backgroundLayer, true);
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

        differenceBetweenPositions(p1, p2) {
            return {x: Math.abs(p1.x - p2.x), y: Math.abs(p1.y - p2.y)};
        }

        markPawns() {
            for (var i = 0; i < this.initialGrid.length; i++) {
                this.grid[i] = this.initialGrid[i].slice();
            }
            for (var i = 0; i < this.game.pawns.length; i++) {
                let p = this.game.pawns[i].getPosition();
                this.grid[p.y][p.x] = 0;
            }
        }
    }
}
