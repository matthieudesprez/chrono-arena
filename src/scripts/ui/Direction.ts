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
                self.select('compass');
                self.changeDirection(self.savedDirection);
            });
            $('.north').on('click', function () {
                self.select('north');
                self.changeDirection('N');
            });
            $('.east').on('click', function () {
                self.select('east');
                self.changeDirection('E');
            });
            $('.south').on('click', function () {
                self.select('south');
                self.changeDirection('S');
            });
            $('.west').on('click', function () {
                self.select('west');
                self.changeDirection('W');
            });
        }

        init(direction) {
            this.savedDirection = direction;
            // TODO ne doit pas être ce qui set le premier ordre xD
            $('.compass').trigger('click');
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
            activePawn.getProjectionOrReal().faceDirection(direction);
            let position = activePawn.getProjectionOrReal().getPosition();
            this.menu.game.orderManager.add('stand_' + direction, activePawn, position.x, position.y);
            this.menu.game.onActionPlayed.dispatch(activePawn);
        }
    }
}
