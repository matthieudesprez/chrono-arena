module TacticArena.UI {
    export class Direction {
        menu;
        element;
        savedDirection;
        matching;

        constructor(menu) {
            var self = this;
            this.menu = menu;
            this.menu.element.append('<div class="ui-direction"><a class="compass"></a><a class="north"></a><a class="south"></a><a class="east"></a><a class="west"></a></div>');
            this.element = this.menu.element.find('.ui-direction');
            this.matching = {'N': 'north', 'E': 'east', 'S': 'south', 'W': 'west'};

            $('.compass').on('click', function () {
                self.changeDirection(self.savedDirection);
            });
            $('.north').on('click', function () {
                self.changeDirection('N');
            });
            $('.east').on('click', function () {
                self.changeDirection('E');
            });
            $('.south').on('click', function () {
                self.changeDirection('S');
            });
            $('.west').on('click', function () {
                self.changeDirection('W');
            });
        }

        init(direction) {
            this.savedDirection = direction;
            this.select(this.matching[direction]);
        }

        select(name) {
            this.deselectAll();
            this.element.find('.' + name).addClass('selected');
        }

        deselectAll() {
            this.element.find('a').removeClass('selected');
        }

        update(direction) {
            this.select(this.matching[direction]);
        }

        changeDirection(direction) {
            let activePawn = this.menu.game.turnManager.getActivePawn();

            if(!this.menu.game.process && activePawn.getAp() > 0) {
                activePawn.createProjection();
                activePawn.getProjectionOrReal().faceDirection(direction);
                let position = activePawn.getProjectionOrReal().getPosition();
                this.menu.game.orderManager.add('stand_' + direction, activePawn, position.x, position.y);
                activePawn.setAp(activePawn.getAp() - 1);
                this.menu.game.onActionPlayed.dispatch(activePawn);
                this.select(this.matching[direction]);
            } else {

            }
        }
    }
}
