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
            var self = this;
            var timeline = '';
            for(var i = 0; i < length; i++) {
                timeline += '<li timeline-index="' + i + '" class="timeline-item"><span class="filling-line"></span><a></a></li>';
            }
            this.element.html(timeline);
            this.element.find('.timeline-item').on('click', function () {
                let index = parseInt($(this).attr('timeline-index'));
                if(index != self.menu.game.resolveManager.currentIndex) {
                    self.menu.game.resolveManager.processSteps(index, false);
                }
            });
        }
    }
}
