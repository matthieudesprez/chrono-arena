module TacticArena.UI {
    export class Notifications {
        menu;
        element;
        actionMapping;
        directionMapping;


        constructor(menu) {
            var self = this;
            this.menu = menu;
            this.menu.element.append('<div class="ui-notifications ui-steps-notifications"></div>');
            this.element = this.menu.element.find('.ui-steps-notifications');
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
            let steps = [];
            for (let i = index; i > this.element.children().length - 1; i--) {
                steps.push($('<div class="item-' + index + '" style="opacity:0; margin-right:-200px;">' + this.getMessage(i) + '</div>'));
            }
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
                let s = step[i].stepUnitData;
                let logColor = '#ffffff';
                //let logColor = '#78dd77';
                // logColor = '#f45d62';

                let msg = '<b>' + e._name + '</b>';
                if(s.moveHasBeenBlocked) {
                    msg += ' essaie de se déplacer en ' + s.positionBlocked.x + ', '+ s.positionBlocked.y + ', ' + ' mais se retrouve bloqué en ' + o.x + ', ' + o.y;
                } else if(o.action == 'move') {
                    msg += ' se déplace en ' + o.x + ', ' + o.y;
                } else if (o.action == 'cast') {
                    msg += ' lance une boule de feu vers ' + this.directionMapping[o.direction];
                } else if (o.action == 'stand') {
                    msg += ' reste en position ' + o.x + ', ' + o.y + ' et surveille vers ' + this.directionMapping[o.direction];
                }
                result.push('<span style="color:' + logColor + ';">' + msg + '</span>');
            }
            return result.join('<br/><br/>');
        }
    }
}
