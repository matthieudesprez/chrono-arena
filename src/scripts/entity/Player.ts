module TypescriptPhaser.Entity {
    export class Player {
        private entity_sprite:Phaser.Sprite;
        game;
        speed:number;
        spriteSize;
        private ext:string;

        constructor(game, x, y, ext) {
            this.game = game;
            this.ext = ext;
            this.speed = 200;
            this.spriteSize = 64;
            this.entity_sprite = this.game.add.sprite(
                this.game.tileSize * x - (this.spriteSize / 4),
                this.game.tileSize * y - (this.spriteSize / 2),
                'player');
            this.entity_sprite.animations.add('standS', ["walkS1"], 6, true);
            this.entity_sprite.animations.add('standN', ["walkN1"], 6, true);
            this.entity_sprite.animations.add('standW', ["walkW1"], 6, true);
            this.entity_sprite.animations.add('standE', ["walkE1"], 6, true);
            this.entity_sprite.animations.add('walkS', ["walkS1","walkS2","walkS3","walkS4","walkS5","walkS6","walkS7","walkS8","walkS9"], 6, true);
            this.entity_sprite.animations.add('walkN', ["walkN1","walkN2","walkN3","walkN4","walkN5","walkN6","walkN7","walkN8","walkN9"], 6, true);
            this.entity_sprite.animations.add('walkW', ["walkW1","walkW2","walkW3","walkW4","walkW5","walkW6","walkW7","walkW8","walkW9"], 6, true);
            this.entity_sprite.animations.add('walkE', ["walkE1","walkE2","walkE3","walkE4","walkE5","walkE6","walkE7","walkE8","walkE9"], 6, true);
            this.stand();
        }

        getPosition() {
            return {
                x: (this.entity_sprite.position.x + this.spriteSize / 4) / this.game.tileSize,
                y: (this.entity_sprite.position.y + this.spriteSize / 2) / this.game.tileSize
            };
        }

        play(animation:string) {
            console.log(animation);
            this.entity_sprite.animations.play(animation);
        }

        faceTo(x:number, y:number) {
            if (this.entity_sprite.x < x) {
                this.ext = 'E';
            }
            else if (this.entity_sprite.x > x) {
                this.ext = 'W';
            }
            if (this.entity_sprite.y < y) {
                this.ext = 'S';
            }
            else if (this.entity_sprite.y > y) {
                this.ext = 'N';
            }
            console.log(this.entity_sprite.x, x, this.entity_sprite.y, y, this.ext);
        }

        walk() {
            this.play('walk' + this.ext);
        }

        stand() {
            this.play('stand' + this.ext);
        }

        goNorth() {
            this.game.preMoveTo(this, this.getPosition().x, this.getPosition().y - 1)
        }

        goSouth() {
            this.game.preMoveTo(this, this.getPosition().x, this.getPosition().y + 1)
        }

        goWest() {
            this.game.preMoveTo(this, this.getPosition().x - 1, this.getPosition().y)
        }

        goEast() {
            this.game.preMoveTo(this, this.getPosition().x + 1, this.getPosition().y)
        }

        goRandom() {
            var direction = this.game.rnd.integerInRange(1, 4);
            if(direction == 1) {
                this.goNorth();
            } else if(direction == 2) {
                this.goSouth();
            } else if(direction == 3) {
                this.goWest();
            } else {
                this.goEast();
            }
        }
    }
}
