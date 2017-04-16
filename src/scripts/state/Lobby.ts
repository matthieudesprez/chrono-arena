module TacticArena.State {
    export class Lobby extends TacticArena.State.BaseState {
        chatUI: UI.Chat;
        serverManager: Controller.ServerManager;
        onChatMessageReception: Phaser.Signal;

        create() {
            var self = this;
            super.createMenu();

            $('#game-menu .ui').html(
                '<div><h2>Entrez un login :</h2></div>' +
                '<div><input type="text" class="login-input" value="Matt"/></div>' +
                '<div class="button submit-login"><a>Confirmer</a></div>'
            );

            $('#game-menu .ui .submit-login').bind('click', function(e) {
               self.initChat($('#game-menu .ui .login-input').val());
            });
            //$('#game-menu .ui .login-input').on('keyup', function (e) {
            //    if (e.keyCode == 13) {
            //        self.initChat($('#game-menu .ui .login-input').val());
            //    }
            //});
        }

        initChat(login) {
            $('#game-menu .ui').html('');
            var self = this;
            this.serverManager = new Controller.ServerManager(this, login, function(data, server=false){
                console.log(data);
                let msg = server ? '<span class="notification">' + data.content + '</span>' : data.name + ': ' + data.content;
                self.chatUI.write(msg);
            }, function(data) {
                self.chatUI.updatePlayersList(data);
            });
            this.chatUI = new UI.Chat(this, this.serverManager);
        }
    }
}
