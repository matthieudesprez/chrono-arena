module TacticArena.UI {
    export class Notifications {
        menu;
        element;
        actionMapping;
        directionMapping;


        constructor(menu) {
            var self = this;
            this.menu = menu;
            this.menu.element.append('<div class="ui-notifications"></div>');
            this.element = this.menu.element.find('.ui-notifications');
            this.directionMapping = {
                'W': "l'Ouest",
                'E': "l'Est",
                'N': "le Nord",
                'S': "le Sud"
            }
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
            this.remove(this.element.find('div[class*="item-"]:gt(' + index + ')'));
            if ($('.item-' + index).length > 0) {
                return;
            }
            console.log(index, this.element.children().length );
            let steps = [];
            for (let i = index; i > this.element.children().length - 1; i--) {
                steps.push($('<div class="item-' + index + '" style="opacity:0; margin-right:-200px;">' + this.getMessage(i) + '</div>'));
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

        getMessage(index) {
            let result = [];
            let step = this.menu.game.logManager.get(this.menu.game.turnManager.currentTurnIndex, index);
            for(let i = 0; i < step.length; i++) {
                let e = step[i].entity;
                let o = step[i].order;
                let logColor = '#ffffff';
                //let logColor = '#78dd77';
                // logColor = '#f45d62';

                let msg = '<b>' + e._name + '</b>';
                if(o.action == 'move') {
                    msg += ' se déplace en ' + o.x + ', ' + o.y;
                } else if (o.action.indexOf('stand_') >= 0) {
                    msg += ' reste en position ' + o.x + ', ' + o.y + ' et surveille vers ' + this.directionMapping[o.direction];
                }
                result.push('<span style="color:' + logColor + ';">' + msg + '</span>');
            }
            return result.join('<br/><br/>');
        }
    }
}
