module TacticArena.UI {
    export class Chat {
        menu;
        element;

        constructor(menu) {
            var self = this;
            this.menu = menu;
            $('body').append('<div class="ui-chat"><div class="content"></div><input type="text"/></div>');
            this.element = $('.ui-chat');

            this.element.find('input').on('focus', function () {
                console.log('focus');
                self.menu.game.input.enabled = false;
            });
            this.element.find('input').focusout(function () {
                self.menu.game.input.enabled = true;
            });
            this.element.find('input').on('keyup', function (e) {
                if (e.keyCode == 13) {
                    self.send();
                }
            });
        }

        write(msg) {
            this.element.find('.content').append(msg + '<br/>');
            this.element.find('.content').scrollTop(this.element.find('.content')[0].scrollHeight - this.element.find('.content').height());
        }

        send() {
            let msg = this.element.find('input').val();
            //this.menu.game.serverManager.send({
            //    "data": {
            //        "name": "Bob",
            //        "message": msg
            //    }
            //});
            this.menu.game.serverManager.send(JSON.stringify({name: 'Bobi', message: 'Hellllllo'}));
            this.write(msg);
            this.element.find('input').val('');
        }

    }
}
