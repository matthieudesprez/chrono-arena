module TacticArena.UI {
    export class Notifications {
        menu;
        element;


        constructor(menu) {
            var self = this;
            this.menu = menu;
            this.menu.element.append('<div class="ui-notifications"></div>');
            this.element = this.menu.element.find('.ui-notifications');
        }

        clean() {
            this.remove(this.element.find('div[class*="item-"]'));
        }

        remove(elements) {
            if (elements.length > 0) {
                let self = this;
                $(elements[elements.length - 1]).animate({opacity: 0, marginRight: -200}, 150, function () {
                    $(this).remove();
                    self.remove(elements.slice(0, -1));
                });
            }
        }

        update(index) {
            this.remove(this.element.find(':gt(' + index + ')'));
            if ($('.item-' + index).length > 0) {
                return;
            }
            console.log(index, this.element.children().length);
            let steps = [];
            for (let i = index; i > this.element.children().length - 1; i--) {
                //steps.push(this.menu.game.logManager.get(this.menu.game.turnManager.currentTurnIndex, i))
                steps.push($('<div class="item-' + index + '" style="opacity:0; margin-right:-200px;">test</div>'));
            }
            console.log(steps);
            this.add(steps);
        }

        add(elements) {
            if (elements.length > 0) {
                let self = this;
                $(elements[elements.length - 1]).appendTo(this.element)
                    .animate({opacity: 1, marginRight: 0}, 150, function () {
                        self.add(elements.slice(0, -1));
                    });
            }
        }


        //var logColor = '#78dd77';
        // logColor = '#f45d62';
        //logInfos.push('<span style="color:' + logColor + ';">entity ' + e._id + ' : ' + o.action + ' ' + o.x + ',' + o.y + '</span>');

    }
}
