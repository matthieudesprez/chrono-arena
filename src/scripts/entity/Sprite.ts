module TypescriptPhaser.Entity {
    export class Sprite extends Phaser.Sprite {
        _entity;
        _speed:number;
        _size;
        private _ext:string;

        constructor(game, x, y, ext, entity, size) {
            super(
                game.game, 
                game.tileSize * x - (size / 4), 
                game.tileSize * y - (size / 2), 
                'player'
            );
            this._entity = entity;
            this._ext = ext;
            this._speed = 200;
            this._size = size;
            this.setAnimations();
        }

        setAnimations() {
            this.animations.add('standS', ["walkS1"], 6, true);
            this.animations.add('standN', ["walkN1"], 6, true);
            this.animations.add('standW', ["walkW1"], 6, true);
            this.animations.add('standE', ["walkE1"], 6, true);
            this.animations.add('walkS', ["walkS2","walkS3","walkS4","walkS5","walkS6","walkS7","walkS8","walkS9"], 12, true);
            this.animations.add('walkN', ["walkN2","walkN3","walkN4","walkN5","walkN6","walkN7","walkN8","walkN9"], 12, true);
            this.animations.add('walkW', ["walkW1","walkW2","walkW3","walkW4","walkW5","walkW6","walkW7","walkW8","walkW9"], 12, true);
            this.animations.add('walkE', ["walkE1","walkE2","walkE3","walkE4","walkE5","walkE6","walkE7","walkE8","walkE9"], 12, true);
        }

        playAnimation(animation:string) {
            this.animations.play(animation);
        }

        faceTo(x:number, y:number) {
            if (this.position.x < x) {
                this._ext = 'E';
            }
            else if (this.position.x > x) {
                this._ext = 'W';
            }
            if (this.position.y < y) {
                this._ext = 'S';
            }
            else if (this.position.y > y) {
                this._ext = 'N';
            }
        }

        walk() {
            this.playAnimation('walk' + this._ext);
        }

        stand() {
            this.playAnimation('stand' + this._ext);
        }
    }
}
