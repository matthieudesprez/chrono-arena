module TacticArena.UI {
    export class Chat {
        menu;
        element;
        playerName;

        constructor(menu) {
            var self = this;
            this.menu = menu;
            this.playerName = '';
            $('body').append('<div class="ui-chat"><div class="content"></div><input type="text"/></div>');
            this.element = $('.ui-chat');

            this.element.find('input').on('focus', function () {
                console.log('focus');
                if(self.playerName.trim() == '') {
                    self.write('Chrono: What\'s your name ?');
                }
                self.menu.game.input.enabled = false;
            });
            this.element.find('input').focusout(function () {
                self.menu.game.input.enabled = true;
            });
            this.element.find('input').on('keyup', function (e) {
                if (e.keyCode == 13) {
                    if(self.playerName.trim() == '') {
                        self.playerName = self.element.find('input').val();
                        self.element.find('input').val('');
                        self.write('Chrono: Nice to meet you ' + self.playerName);
                    } else {
                        self.send();
                    }
                }
            });

            this.element.ready(function() {
                self.write('##################');
                self.write('<b># Chrono <span style="color:orangered;">A</span>' +
                    '<span style="color:limegreen;">r</span>' +
                    '<span style="color:cyan;">e</span>' +
                    '<span style="color:yellow;">n</span>' +
                    '<span style="color:orangered;">a</span> #</b>');
                self.write('##################<br/>');
            });
        }

        write(msg) {
            this.element.find('.content').append(msg + '<br/>');
            this.element.find('.content').scrollTop(this.element.find('.content')[0].scrollHeight - this.element.find('.content').height());
        }

        send() {
            let self = this;
            this.menu.game.serverManager.send(JSON.stringify({
                name: self.playerName,
                message: this.element.find('input').val()})
            ).then( (res) => {
                self.element.find('input').val('');
            });
        }

    }
}
