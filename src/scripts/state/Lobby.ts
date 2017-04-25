module TacticArena.State {
    export class Lobby extends TacticArena.State.BaseState {
        menu;
        login;
        chatUI:UI.Chat;
        dialogUI:UI.Dialog;
        factionSelectionUI:UI.FactionSelection;
        serverManager:Controller.ServerManager;
        onChatMessageReception:Phaser.Signal;
        selected_faction;
        generator;

        create() {
            var self = this;
            super.createMenu();
            this.generator = new Utils.Generator();
            this.menu = $('#game-menu .ui');


            this.menu.html(
                '<div><h2>Entrez un login :</h2></div>' +
                '<div><input type="text" class="login-input" value="' + this.generator.generate() + '"/></div>' +
                '<div class="button submit-login"><a>Confirmer</a></div>'
            );

            this.menu.find('.submit-login').bind('click', function (e) {
                self.login = $('#game-menu .ui .login-input').val();
                self.initChat(self.login);
            });
            this.menu.find('.login-input').on('keyup', function (e) {
                console.log(e);
                if (e.keyCode == 13) {
                    self.initChat($('#game-menu .ui .login-input').val());
                }
            });
        }

        initChat(login) {
            this.menu.html('');
            var self = this;
            this.serverManager = new Controller.ServerManager(this, login, function (data, server = false) {
                console.log(data);
                let msg = server ? '<span class="notification">' + data.content + '</span>' : data.name + ': ' + data.content;
                self.chatUI.write(msg);
            }, function (data) {
                self.chatUI.updatePlayersList(data);
            }, function (message, token) {
                self.dialogUI.show('Duel !', message, 'Accepter', 'Décliner', function () {
                    self.serverManager.request('ACCEPT_DUEL', token);
                    self.factionSelectionUI.init('online');
                    $(this).dialog("close");
                }, function () {
                    self.serverManager.request('DECLINE_DUEL', token);
                    $(this).dialog("close");
                });
            }, function (data) {
                self.factionSelectionUI.init('online');
            }, function (data) {
                self.game.state.start('mainmultiplayeronline', true, false, data, self.chatUI, self.serverManager);
            });
            this.chatUI = new UI.Chat(this, this.serverManager);
            this.dialogUI = new UI.Dialog(this);
            this.factionSelectionUI = new UI.FactionSelection(this, this.menu);
        }
    }
}
