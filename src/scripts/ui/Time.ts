module TacticArena.UI {
    export class Time {
        menu;
        element;

        constructor(menu) {
            var self = this;
            this.menu = menu;
            this.menu.element.append('<ul class="ui-menu ui-time-menu"><li class="pause"></li><li class="play"></li></ul>');
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

            this.element.find('.pause').trigger('click');
        }

        goForward() {
            if(this.menu.game.resolveManager.active && !this.menu.game.resolveManager.processing) {
                let nextIndex = this.menu.game.resolveManager.currentIndex + 1;
                if(nextIndex >= this.menu.game.resolveManager.steps.length) {
                    this.menu.game.isPaused = false;
                }
                this.menu.game.resolveManager.processSteps(nextIndex);
            }
        }

        goBackward() {
            if(this.menu.game.resolveManager.active && !this.menu.game.resolveManager.processing) {
                this.element.find('.pause').trigger('click');
                let previousIndex = this.menu.game.resolveManager.currentIndex -1;
                if(previousIndex >= 0) {
                    this.menu.game.resolveManager.processSteps(previousIndex, true, true);
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
