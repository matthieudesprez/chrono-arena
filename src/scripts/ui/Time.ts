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
            });

            this.element.find('.next').on('click', function () {
                if(self.menu.game.process) {
                    self.menu.game.isPaused = false;
                    self.menu.game.orderManager.isProcessingPromise().then((res) => {
                        self.menu.game.isPaused = true;
                    });
                }
            });

            this.element.find('.pause').trigger('click');
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
    }
}
