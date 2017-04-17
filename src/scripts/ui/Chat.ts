module TacticArena.UI {
    export class Chat {
        menu;
        element;
        serverManager;
        currentChannel;

        constructor(menu, serverManager) {
            var self = this;
            this.menu = menu;
            this.serverManager = serverManager;
            $('body').append('<div class="ui-chat"><div class="channels-list"></div><div class="content"></div><input id="ui-chat-input" type="text"/></div>');
            this.element = $('.ui-chat');

            this.element.find('input').on('focus', function () {
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

            this.element.ready(function () {
                self.write('################');
                self.write('<b># Chrono <span style="color:orangered;">A</span>' +
                    '<span style="color:limegreen;">r</span>' +
                    '<span style="color:cyan;">e</span>' +
                    '<span style="color:yellow;">n</span>' +
                    '<span style="color:orangered;">a</span> #</b>');
                self.write('################<br/>');
            });

            this.currentChannel = 'general';
        }

        write(msg) {
            this.element.find('.content').append(msg + '<br/>');
            this.element.find('.content').scrollTop(this.element.find('.content')[0].scrollHeight - this.element.find('.content').height());
        }

        updatePlayersList(data) {
            let self = this;
            let playersList = '<li class="channel-general">General</li>';
            console.log(self.serverManager.token);
            data.content.forEach(p => {
                if (p.token != self.serverManager.token) {
                    playersList += '<li class="channel-player" id="' + p.token + '">' + p.name + '</li>';
                }
            });
            this.element.find('.channels-list').html('<ul>' + playersList + '</ul>');
            //this.element.find('.channel-player').on('click', function() {
            //
            //});
            $.contextMenu({
                selector: ".channel-player",
                items: {
                    duel: {
                        name: "Provoquer en duel", callback: function (key, opt) {
                            let token = opt.$trigger.attr("id");
                            self.serverManager.ask('ASK_DUEL', token);
                            self.write('<span class="notification">La demande a été envoyée à ' + opt.$trigger.html() + '</span>');
                        }
                    }
                }
            });
            this.selectChannel(this.currentChannel);
        }

        send() {
            let self = this;
            this.serverManager.send({
                    name: self.serverManager.login,
                    content: this.element.find('input').val()
                }
            ).then((res) => {
                self.element.find('input').val('');
            });
        }

        selectChannel(name) {
            this.element.find('.channels-list').find('li').removeClass('selected');
            this.element.find('.channels-list').find('.channel-' + name).addClass('selected');
        }
    }
}
