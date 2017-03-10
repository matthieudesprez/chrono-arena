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
            //this.menu.element.append('<ul class="cd-timeline-navigation"><li><a href="" class="prev inactive">Prev</a></li><li><a href="" class="next">Next</a></li></ul>');
            this.element = this.menu.element.find('.ui-timeline-menu');
            this.build(4);
        }

        deselectAll() {
            this.element.find('li').removeClass('selected').removeClass('previous');
        }

        select(query) {
            this.element.find(query).addClass('selected');
        }

        update(index) {
            this.deselectAll();
            this.select('[timeline-index=' + index + ']');
            for(var i = index - 1; i >= 0; i--) {
                this.element.find('[timeline-index=' + i + ']').addClass('previous');
            }
        }

        build(length) {
            console.log(length);
            var self = this;
            var timeline = '';
            for(var i = 0; i < length; i++) {
                //timeline += '<li timeline-index="' + i + '" class="timeline-item"><span class="filling-line"></span><a></a></li>';
                timeline += '<li timeline-index="' + i + '" class="timeline-item"><div class="line"></div><div class="square">' + i + '</div></li>';
            }
            this.element.html(timeline);
            //$('.timeline-item').css('opacity', '0');
            //$('.timeline-item:after').css('width', '0px');
            this.element.find('.timeline-item').on('click', function () {
                let index = parseInt($(this).attr('timeline-index'));
                if(index != self.menu.game.resolveManager.currentIndex) {
                    self.menu.game.resolveManager.processSteps(index, false);
                }
            });
            //this.display($('.timeline-item'));
        }

        display(elements) {
            console.log(elements);
            if (elements.length > 0) {
                let self = this;
                $(elements[0]).animate({opacity: 1}, 500, function () {
                    console.log($(this).find('.line'));
                    $(this).find('.line').animate({width: '91px'}, 500, function () {
                        console.log('oki');
                        self.display(elements.slice(1));
                    });
                });
            }
        }
    }
}
