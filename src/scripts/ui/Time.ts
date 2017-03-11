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
                self.pause();
            });

            this.element.find('.play').on('click', function () {
                self.deselectAll();
                self.select('play');
                self.menu.game.isPaused = false;

                self.goForward();
            });

            this.pause();
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

        pause() {
            this.deselectAll();
            this.select('pause');
            this.menu.game.isPaused = true;
        }

        goBackward() {
            if(this.menu.game.resolveManager.active && !this.menu.game.resolveManager.processing) {
                this.pause();
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
                this.pause();
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
