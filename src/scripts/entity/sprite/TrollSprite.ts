module TacticArena.Sprite {
    export class TrollSprite extends Sprite.BaseSprite {

        constructor(state, x, y, ext, type, size = 150, tint = null) {
            super(state, x, y, ext, type, size, tint);
            this.anchor.set(0.4, 0.45);
        }

        setAnimations() {
            this.animations.add('standS', Array(8).fill(null).map((_, i) => 'Idle/2/' + i), 8, true);
            this.animations.add('standN', Array(8).fill(null).map((_, i) => 'Idle/0/' + i), 8, true);
            this.animations.add('standW', Array(8).fill(null).map((_, i) => 'Idle/3/' + i), 8, true);
            this.animations.add('standE', Array(8).fill(null).map((_, i) => 'Idle/1/' + i), 8, true);
            this.animations.add('walkS', Array(8).fill(null).map((_, i) => 'Move/2/' + i), 12, true);
            this.animations.add('walkN', Array(8).fill(null).map((_, i) => 'Move/0/' + i), 12, true);
            this.animations.add('walkW', Array(8).fill(null).map((_, i) => 'Move/3/' + i), 12, true);
            this.animations.add('walkE', Array(8).fill(null).map((_, i) => 'Move/1/' + i), 12, true);
            this.animations.add('attackS', Array(12).fill(null).map((_, i) => 'Attack/2/' + i).concat(['Idle/2/0']), 12, false);
            this.animations.add('attackN', Array(12).fill(null).map((_, i) => 'Attack/0/' + i).concat(['Idle/0/0']), 12, false);
            this.animations.add('attackW', Array(12).fill(null).map((_, i) => 'Attack/3/' + i).concat(['Idle/3/0']), 12, false);
            this.animations.add('attackE', Array(12).fill(null).map((_, i) => 'Attack/1/' + i).concat(['Idle/1/0']), 12, false);
            this.animations.add('castS', Array(8).fill(null).map((_, i) => 'Idle/2/' + i), 10, false);
            this.animations.add('castN', Array(8).fill(null).map((_, i) => 'Idle/0/' + i), 10, false);
            this.animations.add('castW', Array(8).fill(null).map((_, i) => 'Idle/3/' + i), 10, false);
            this.animations.add('castE', Array(8).fill(null).map((_, i) => 'Idle/1/' + i), 10, false);
            this.animations.add('halfcastS', Array(8).fill(null).map((_, i) => 'Idle/2/' + i), 10, false);
            this.animations.add('halfcastN', Array(8).fill(null).map((_, i) => 'Idle/0/' + i), 10, false);
            this.animations.add('halfcastW', Array(8).fill(null).map((_, i) => 'Idle/3/' + i), 10, false);
            this.animations.add('halfcastE', Array(8).fill(null).map((_, i) => 'Idle/1/' + i), 10, false);
            this.animations.add('dying', Array(8).fill(null).map((_, i) => 'Idle/2/' + i), 10, false);
            this.events.onAnimationComplete.add(this.animationComplete, this);
        }

        //TODO change x, y to position: Position
        moveTo(x, y, path = [], animate = true, faceDirection = false, playWalkAnimation = true): Promise<any> {
            return new Promise((resolve, reject) => {
                var tile_y, tile_x;
                if (path != undefined && path.length > 0) {
                    tile_y = path[0].y;
                    tile_x = path[0].x;
                    path.shift();
                } else {
                    tile_y = Math.floor(y);
                    tile_x = Math.floor(x);
                }
                var tile = this.state.stageManager.map.layers[1].data[tile_y][tile_x];
                var newX = tile.x * this.state.game.tileSize;
                var newY = tile.y * this.state.game.tileSize;
                if (this.x == newX && this.y == newY) { return resolve(true);}
                if (animate) {
                    if (faceDirection) {
                        this.faceTo(newX, newY);
                    }
                    if (playWalkAnimation && this.animations.currentAnim.name != 'walk' + this._ext) {
                        this.walk();
                    }
                    var t = this.game.add.tween(this).to({
                        x: newX,
                        y: newY
                    }, this._speed, Phaser.Easing.Linear.None, true);
                    t.onComplete.add(function () {
                        if (path != undefined && path.length > 0) {
                            this.moveTo(0, 0, path, animate, faceDirection).then((res) => {
                                resolve(res);
                            }); // recursive
                        } else {
                            resolve(true);
                        }
                    }, this);
                } else {
                    this.x = newX;
                    this.y = newY;
                    resolve(true);
                }
            });
        }

        getPosition(): Position {
            return new Position(
                this.position.x / this.state.game.tileSize,
                this.position.y / this.state.game.tileSize,
                this._ext
            );
        }

        update() {
            if(this._ext === 'S') {
                this.anchor.set(0.48, 0.45);
            } else if(this._ext === 'N') {
                this.anchor.set(0.36, 0.45);
            } else {
                this.anchor.set(0.4, 0.45);
            }
        }
    }
}
