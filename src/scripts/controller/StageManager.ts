module TacticArena {
    export class StageManager {
        game;
        map:Phaser.Tilemap;
        parallaxLayer;
        backgroundLayer;
        uiLayer;
        foregroundLayer;
        collisionLayer;
        decorationLayer1;
        decorationLayer2;
        decorationLayer3;
        blackLayer;
        grid;
        initialGrid;

        constructor(game) {
            this.game = game;
            this.map = null;
            this.backgroundLayer = null;
            this.uiLayer = null;
            this.foregroundLayer = null;
            this.decorationLayer1 = null;
            this.decorationLayer2 = null;
            this.decorationLayer3 = null;
            this.collisionLayer = null;
            this.blackLayer = null;
            this.grid = [];
            this.initialGrid = [];
        }

        init(map) {
            this.map = this.game.make.tilemap(map.name);
            this.map.addTilesetImage('tiles-collection', 'tiles-collection', this.game.game.tileSize, this.game.game.tileSize, 0, 0);
            if(map.hasParallaxLayer) {
                this.parallaxLayer = this.game.mapGroup.add(this.map.createLayer('Parallax'));
                this.parallaxLayer.scrollFactorX = 0.5;
                this.parallaxLayer.scrollFactorY = 0.5;
            }
            this.backgroundLayer = this.game.mapGroup.add(this.map.createLayer('Background'));
            this.uiLayer = this.game.mapGroup.add(this.map.createBlankLayer('UI', this.backgroundLayer.layer.data[0].length, this.backgroundLayer.layer.data.length, this.game.game.tileSize, this.game.game.tileSize));
            this.foregroundLayer = this.game.mapGroup.add(this.map.createLayer('Foreground'));
            this.collisionLayer = this.game.mapGroup.add(this.map.createLayer('Collision'));
            //this.collisionLayer.debug = true;
            this.decorationLayer1 = this.game.mapGroup.add(this.map.createLayer('Decorations'));
            this.decorationLayer2 = this.game.mapGroup.add(this.map.createLayer('Decorations2'));

            this.initGrid();
            this.backgroundLayer.resizeWorld();
        }

        initFromArray(data, width=160, height=160, start={x:0, y:0}) {
            this.map = this.game.add.tilemap();
            width = data.background.layer.width;
            height = data.background.layer.height;

            this.map.addTilesetImage('tiles-collection', 'tiles-collection', this.game.game.tileSize, this.game.game.tileSize, 0, 0, 1);
            this.parallaxLayer = this.map.create('Parallax', width, height, this.game.game.tileSize, this.game.game.tileSize);
            this.parallaxLayer.scrollFactorX = 0.5;
            this.parallaxLayer.scrollFactorY = 0.5;
            this.backgroundLayer = this.map.createBlankLayer('Background', width, height, this.game.game.tileSize, this.game.game.tileSize);
            this.uiLayer = this.map.createBlankLayer('UI', width, height, this.game.game.tileSize, this.game.game.tileSize);
            this.foregroundLayer = this.map.createBlankLayer('Foreground', width, height, this.game.game.tileSize, this.game.game.tileSize);
            this.collisionLayer = this.map.createBlankLayer('Collision', width, height, this.game.game.tileSize, this.game.game.tileSize);
            //this.collisionLayer.debug = true;
            this.decorationLayer1 = this.map.createBlankLayer('Decorations', width, height, this.game.game.tileSize, this.game.game.tileSize);
            this.decorationLayer2 = this.map.createBlankLayer('Decorations2', width, height, this.game.game.tileSize, this.game.game.tileSize);

            this.map.paste(0, 0, data.background.map.copy(start.x, start.y, width, height, data.parallax), this.parallaxLayer);
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
                    //this.map.removeTile(x, y, 'Collision');
                    let tile = this.map.getTile(x, y, this.collisionLayer, true);
                    tile.alpha = 0;
                }
            }
            this.collisionLayer.layer.dirty = true;
        }

        addDecorations() {
            this.decorationLayer3 = this.game.mapDecorationGroup.add(this.map.createLayer('Decorations3'));
        }

        addDecorationsFromData(data) {
            let width = data.stage.background.layer.width;
            let height = data.stage.background.layer.height;
            this.decorationLayer3 = this.map.createBlankLayer('Decorations3', width, height, this.game.game.tileSize, this.game.game.tileSize);
            this.map.paste(0, 0, data.stage.background.map.copy(0, 0, width, height, data.stage.decoration3), this.decorationLayer3);
        }

        addBlackLayer(data) {
            let width = data.stage.background.layer.width;
            let height = data.stage.background.layer.height;
            this.blackLayer = this.map.createBlankLayer('Black', width, height, this.game.game.tileSize, this.game.game.tileSize);
            let endX = data.startPosition.x + data.gridWidth;
            let endY = data.startPosition.y + data.gridHeight;
            for (var x = 0; x < width; x++) {
                for (var y = 0; y < height; y++) {
                    if(x < data.startPosition.x || x > endX || y < data.startPosition.y || y > endY) {
                        let tile = this.map.putTile(9, x, y, this.blackLayer);
                        if (tile) {
                            tile.alpha = 0.8;
                            this.grid[y][x] = 1;
                        }
                    }
                }
            }
        }

        fillBlack() {
            return new Promise((resolve, reject) => {
                let width = this.backgroundLayer.layer.width;
                let height = this.backgroundLayer.layer.height;
                this.blackLayer = this.map.createBlankLayer('Black', width, height, this.game.game.tileSize, this.game.game.tileSize);
                let startX = Math.floor(Math.abs(this.game.world.position.x) / this.game.game.tileSize);
                let startY = Math.floor(Math.abs(this.game.world.position.y) / this.game.game.tileSize);
                let endX = startX + 20;
                let endY = startY + 19;
                let self = this;
                let x = startX;
                let y = startY;
                let interval = setInterval(function () {
                    if (y >= endY) {
                        clearInterval(interval);
                        resolve(true);
                    }
                    if (x >= endX) {
                        x = startX;
                        y++;
                    }
                    self.map.putTile(9, x, y, self.blackLayer);
                    self.blackLayer.layer.dirty = true;
                    x++;
                }, 5);
            });
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

        isObstacle(position) {
            return this.grid[position.y][position.x] != -1;
        }

        canMove(position, x, y, ap = Infinity) {
            return new Promise((resolve, reject) => {
                this.game.pathfinder.findPath(position.x, position.y, x, y, function (path) {
                    if (path && path.length > 0) {
                        path.shift();
                        if (path.length > ap) {
                            reject(path);
                        } else {
                            let formatedPath = [];
                            path.forEach(p => {
                                formatedPath.push(new Position(p.x, p.y));
                            });
                            resolve(formatedPath);
                        }
                    } else {
                        reject(path);
                    }
                });
                this.game.pathfinder.calculate();
            });
        }

        // TODO create Path class
        getLinearPath(position: Position, distance, direction): Array<any> {
            let path = [];
            let startCornerX = Math.max(0, position.x - distance);
            let endCornerX = Math.min(this.map.width, position.x + distance);
            let startCornerY = Math.max(0, position.y - distance);
            let endCornerY = Math.min(this.map.height, position.y + distance);
            for (var x = startCornerX; x <= endCornerX; x++) {
                for (var y = startCornerY; y <= endCornerY; y++) {
                    if (
                        (direction == 'W' && position.x > x && position.y == y ||
                        direction == 'E' && position.x < x && position.y == y ||
                        direction == 'N' && position.x == x && position.y > y ||
                        direction == 'S' && position.x == x && position.y < y) &&
                        this.getNbTilesBetween(position, {'x': x, 'y': y}) <= distance
                    ) {
                        path.push({'x': x, 'y': y});
                    }
                }
            }
            return path;
        }

        getLinearPathsAllDirections(position: Position, distance) {
            return {
                W: this.getLinearPath(position, distance, 'W'),
                E: this.getLinearPath(position, distance, 'E'),
                N: this.getLinearPath(position, distance, 'N'),
                S: this.getLinearPath(position, distance, 'S')
            };
        }

        showPossibleLinearTrajectories(path) {
            this.clearPossibleMove();
            for (var i = 0; i < path.length; i++) {
                //let tile = this.map.getTile(path[i].x, path[i].y, this.backgroundLayer, true);
                let tile = this.map.putTile(2105, path[i].x, path[i].y, this.uiLayer);
                if (tile) {
                    tile.alpha = 0.5;
                }
            }
            this.backgroundLayer.layer.dirty = true;
        }

        showPossibleMove(position, ap) {
            for (var x = 0; x < this.map.width; x++) {
                for (var y = 0; y < this.map.height; y++) {
                    //let tile = this.map.getTile(x, y, this.backgroundLayer, true);
                    //tile.alpha = ap > 0 && this.getNbTilesBetween(position, {'x': x, 'y': y}) <= ap ? 0.7 : 1;
                    if(
                        this.getNbTilesBetween(position, {'x': x, 'y': y}) <= ap &&
                        this.grid[y][x] == -1 &&
                        this.backgroundLayer.layer.data[y][x].index > -1
                    ) {
                        let tile = this.map.putTile(2105, x, y, this.uiLayer);
                        tile.alpha = 0.5;
                    }
                }
            }
            this.backgroundLayer.layer.dirty = true;
        }

        clearPossibleMove() {
            for (var x = 0; x < this.map.width; x++) {
                for (var y = 0; y < this.map.height; y++) {
                    //let tile = this.map.getTile(x, y, this.backgroundLayer, true);
                    //tile.alpha = 1;
                    this.map.removeTile(x, y, this.uiLayer);
                }
            }
            this.backgroundLayer.layer.dirty = true;
        }

        showPath(path, group, tint = null) {
            for (var i = 0; i < (path as any).length; i++) {
                let tile = this.map.getTile(path[i].x, path[i].y, this.backgroundLayer, true);
                if (tile) {
                    let tileSprite = new Phaser.Sprite(this.game, tile.x * this.game.game.tileSize, tile.y * this.game.game.tileSize, 'path-tile', '');
                    if (tint) {
                        tileSprite.tint = tint;
                    }
                    group.add(tileSprite);
                }
            }
        }

        clearPath(group) {
            group.removeAll();
        }

        clearHelp() {
            this.clearPossibleMove();
            this.clearPath(this.game.pathTilesGroup);
            this.game.pointer.uiLastPosition = new Position(-1, -1);
        }

        getNbTilesBetween(coordsA, coordsB) {
            return Math.abs(coordsA.x - coordsB.x) + Math.abs(coordsA.y - coordsB.y);
        }

        isFacingAway(coordsA, directionA, coordsB) {
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
            for (var i = 0; i < this.game.pawns.length; i++) {
                let p = this.game.pawns[i].getPosition();
                this.grid[p.y][p.x] = 0;
            }
        }

        getPosition(absolutePosition:Phaser.Point):Position {
            return new Position(
                Math.floor(absolutePosition.x / this.game.worldGroup.scale.x / this.game.game.tileSize),
                Math.floor(absolutePosition.y / this.game.worldGroup.scale.y / this.game.game.tileSize)
            );
        }
    }
}
