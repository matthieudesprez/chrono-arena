module TypescriptPhaser.Entity {
    export class Player {
        private entity_sprite:Phaser.Sprite;
        game;
        speed:number;
        private ext:string;

        constructor(game) {
            this.game = game;
            this.ext = 'down';
            this.speed = 200;
            this.entity_sprite = this.game.add.sprite(this.game.tileSize * 10, this.game.tileSize * 2, 'player');
            this.entity_sprite.animations.add('stand_down', ["stand_down"], 5, true);
            this.entity_sprite.animations.add('stand_up', ["stand_up"], 5, true);
            this.entity_sprite.animations.add('stand_left', ["stand_left"], 5, true);
            this.entity_sprite.animations.add('stand_right', ["stand_right"], 5, true);
            this.entity_sprite.animations.add('walk_down', ["walk_down_01", "walk_down_02"], 5, true);
            this.entity_sprite.animations.add('walk_up', ["walk_up_01", "walk_up_02"], 5, true);
            this.entity_sprite.animations.add('walk_left', ["walk_left_01", "walk_left_02"], 5, true);
            this.entity_sprite.animations.add('walk_right', ["walk_right_01", "walk_right_02"], 5, true);
        }

        getPosition() {
            return {
                x: this.entity_sprite.position.x / this.game.tileSize,
                y: this.entity_sprite.position.y / this.game.tileSize
            };
        }

        play(animation:string) {
            console.log(animation)
            this.entity_sprite.animations.play(animation);
        }

        faceTo(x:number, y:number) {
            if (this.entity_sprite.x < x) {
                this.ext = 'right';
            }
            else if (this.entity_sprite.x > y) {
                this.ext = 'left';
            }
            if (this.entity_sprite.y < y) {
                this.ext = 'down';
            }
            else if (this.entity_sprite.y > y) {
                this.ext = 'up';
            }
        }

        walk() {
            this.play('walk_' + this.ext);
        }

        stand() {
            this.play('stand_' + this.ext);
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
