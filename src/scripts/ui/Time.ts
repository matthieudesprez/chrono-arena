module TacticArena.UI {
    export class Time {
        menu;
        element;

        constructor(menu) {
            var self = this;
            this.menu = menu;
            this.menu.element.append('<ul class="ui-menu ui-time-menu"><li class="pause"></li><li class="play"></li><li class="next"></ul>');
            this.element = this.menu.element.find('.ui-time-menu');

            this.element.find('.pause').on('click', function () {
                self.deselectAll();
                self.select('pause');
                self.menu.game.isPaused = true;
            });

            this.element.find('.play').on('click', function () {
                self.deselectAll();
                self.select('play');
                self.menu.game.isPaused = false;
                self.goForward();
            });

            this.element.find('.next').on('click', function () {
                self.goForward();
            });

            this.element.find('.pause').trigger('click');
        }

        goForward() {
            if(this.menu.game.process) {
                console.log(this.menu.game.isPaused);
                let nextIndex = this.menu.game.resolveManager.currentIndex + 1;
                if(nextIndex < this.menu.game.resolveManager.steps.length) {
                    this.menu.game.resolveManager.processStep(nextIndex);
                } else {
                    this.menu.game.resolveManager.canResolve = true;
                }
            }
        }

        goBackward() {
            if(this.menu.game.process) {
                let previousIndex = this.menu.game.resolveManager.currentIndex -1;
                if(previousIndex >= 0) {
                    this.menu.game.resolveManager.processStep(previousIndex);
                }
            }
        }

        togglePause() {
            if(this.menu.game.isPaused) {
                this.element.find('.play').trigger('click');
            } else {
                this.element.find('.pause').trigger('click');
            }
        }

        deselectAll() {
            this.element.find('li').removeClass('selected');
        }

        select(name) {
            this.element.find('.' + name).addClass('selected');
        }

        update() {
            if(this.menu.game.isPaused) {
                this.deselectAll();
                this.select('pause');
            } else {
                this.deselectAll();
                this.select('play');
            }
        }

        updatePauseFromSelected() {
            this.menu.game.isPaused = this.element.find('.pause').hasClass('selected');
        }
    }
}
