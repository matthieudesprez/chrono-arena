module TacticArena.UI {
    export class TimeLine {
        menu;
        element;

        constructor(menu) {
            var self = this;
            this.menu = menu;
            this.menu.element.append('<ul class="ui-menu ui-timeline-menu"></ul>');
            this.element = this.menu.element.find('.ui-timeline-menu');
        }

        deselectAll() {
            this.element.find('li').removeClass('selected');
        }

        select(query) {
            this.element.find(query).addClass('selected');
        }

        update(index) {
            this.deselectAll();
            this.select('[timeline-index=' + index + ']');
        }

        build(length) {
            var self = this;
            var timeline = '';
            for(var i = 0; i < length; i++) {
                timeline += '<li class="timeline-item" timeline-index="' + i + '"><span></span>|</li>';
            }
            this.element.html(timeline);
            this.element.find('.timeline-item').on('click', function () {
                let index = $(this).attr('timeline-index');
                if(index != self.menu.game.resolveManager.currentIndex) {
                    self.menu.game.resolveManager.processStep(index);
                }
            });
        }
    }
}
