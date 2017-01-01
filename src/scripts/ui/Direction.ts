module TacticArena.UI {
    export class Direction {
        menu;
        element;
        savedDirection;
        matching;

        constructor(menu) {
            var self = this;
            this.menu = menu;
            this.element = this.menu.element.querySelector('.ui-direction');

            this.matching = {'N': 'north', 'E': 'east', 'S': 'south', 'W': 'west'};

            this.getButton('.compass').addEventListener('click', function() {
            	self.select('compass');
                self.changeDirection(self.savedDirection);
            });
            this.getButton('.north').addEventListener('click', function() {
            	self.select('north');
                self.changeDirection('N');
            });
            this.getButton('.east').addEventListener('click', function() {
            	self.select('east');
                self.changeDirection('E');
            });
            this.getButton('.south').addEventListener('click', function() {
            	self.select('south');
                self.changeDirection('S');
            });
            this.getButton('.west').addEventListener('click', function() {
            	self.select('west');
                self.changeDirection('W');
            });
        }

        init(direction) {
        	this.savedDirection = direction;
            this.getButton('.compass').click();
        }

        getButton(query) {
            return this.element.querySelector(query);
        }

        select(name) {
        	this.deselectAll();
            this.getButton('.' + name).classList.add('selected');
        }

        deselectAll() {
            var buttons = this.element.querySelectorAll('a');
            for(var i=0; i < buttons.length; i++) {
                buttons[i].classList.remove('selected');
            }
        }

        update(direction) {
        	this.select(this.matching[direction]);
        }

    	changeDirection(direction) {
            var activePawn = this.menu.game.turnManager.getActivePawn();
            activePawn.faceDirection(direction);
            this.menu.game.orderManager.add('stand_' + direction, activePawn, activePawn.getPosition().x, activePawn.getPosition().y);
    	}
    }
}
