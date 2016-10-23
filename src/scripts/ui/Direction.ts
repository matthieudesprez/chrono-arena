module TacticArena.UI {
    export class Direction {
        menu;
        element;
        savedDirection;

        constructor(menu) {
            var self = this;
            this.menu = menu;
            this.element = this.menu.element.querySelector('.ui-direction');

            this.getButton('.compass').addEventListener('click', function() {
            	self.deselectAll();
                self.getButton('.compass').classList.add('selected');
                self.changeDirection(self.savedDirection);
            });
            this.getButton('.north').addEventListener('click', function() {
            	self.deselectAll();
                self.getButton('.north').classList.add('selected');
                self.changeDirection('N');
            });
            this.getButton('.east').addEventListener('click', function() {
            	self.deselectAll();
                self.getButton('.east').classList.add('selected');
                self.changeDirection('E');
            });
            this.getButton('.south').addEventListener('click', function() {
            	self.deselectAll();
                self.getButton('.south').classList.add('selected');
                self.changeDirection('S');
            });
            this.getButton('.west').addEventListener('click', function() {
            	self.deselectAll();
                self.getButton('.west').classList.add('selected');
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

        deselectAll() {
            var buttons = this.element.querySelectorAll('a');
            for(var i=0; i < buttons.length; i++) {
                buttons[i].classList.remove('selected');
            }
        }

    	changeDirection(direction) {
            var activePawn = this.menu.game.turnManager.getActivePawn();
            activePawn.faceDirection(direction);
    	}
    }
}
