module TacticArena.UI {
    export class TimeLine {
        menu;
        element;
        container;

        constructor(menu) {
            var self = this;
            this.menu = menu;
            this.menu.element.append('<div class="timeline-container"></div>');
            this.container = this.menu.element.find('.timeline-container');
            this.container.append('<ul class="ui-timeline-menu"></ul>');
            this.container.append('<a class="prev inactive"><</a><a class="next">></a>');
            this.element = this.menu.element.find('.ui-timeline-menu');
            //this.build(4);

            this.container.find('.prev').on('click', function () {
                self.menu.timeUI.goBackward();
            });
            this.container.find('.next').on('click', function () {
                self.menu.timeUI.goForward();
            });
        }

        deselectAll() {
            this.element.find('li').removeClass('selected').removeClass('previous');
        }

        select(query) {
            this.element.find(query).addClass('selected');
        }

        clean() {
            var self = this;
            this.container.fadeOut(500, function() {
                self.container.find('.prev, .next').css('opacity', '0');
                self.element.html('');
            });
        }

        update(index) {
            console.log('update', index, this.menu.game.resolveManager.steps.length);
            this.deselectAll();
            this.select('[timeline-index=' + index + ']');
            for(var i = index - 1; i >= 0; i--) {
                this.element.find('[timeline-index=' + i + ']').addClass('previous');
            }

            if(index == 0) {
                this.container.find('.prev').css('opacity', '0.2');
            } else {
                this.container.find('.prev').css('opacity', '1');
            }
            if(index == this.menu.game.resolveManager.steps.length - 1) {
                this.container.find('.next').html('Confirm');
            } else {
                this.container.find('.next').html('>');
            }
        }

        build(length) {
            return new Promise((resolve, reject) => {
                var self = this;
                var timeline = '';
                for (var i = 0; i < length; i++) {
                    timeline += '<li timeline-index="' + i + '" class="timeline-item"><div class="line"></div><div class="square">' + i + '</div></li>';
                }
                this.element.html(timeline);
                this.element.find('.timeline-item').on('click', function () {
                    let index = parseInt($(this).attr('timeline-index'));
                    if (index != self.menu.game.resolveManager.currentIndex) {
                        self.menu.game.resolveManager.processSteps(index, false);
                    }
                });
                $('.timeline-item .square').css('opacity', '0');
                $('.timeline-item .line').css('width', '0px');
                $('.timeline-container .prev, .timeline-container .next').css('opacity', '0');
                this.container.show();
                this.display($('.timeline-item')).then(() => {
                    resolve(true);
                });
            });
        }

        display(elements) {
            return new Promise((resolve, reject) => {
                if (elements.length > 0) {
                    let self = this;
                    $(elements[0]).find('.line').animate({width: '91px'}, 200, function () {
                        $(elements[0]).find('.square').animate({opacity: 1}, 100, function () {
                            self.display(elements.slice(1)).then(() => {
                                resolve(true);
                            });
                        });
                    });
                } else {
                    $('.timeline-container .prev').css('opacity', '0.2');
                    $('.timeline-container .next').css('opacity', '1');
                    resolve(true);
                }
            });
        }
    }
}
