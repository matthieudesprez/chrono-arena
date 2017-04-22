module TacticArena.State {
    export class Lobby extends TacticArena.State.BaseState {
        chatUI:UI.Chat;
        dialogUI:UI.Dialog;
        serverManager:Controller.ServerManager;
        onChatMessageReception:Phaser.Signal;
        selected_faction;
        generator;

        create() {
            var self = this;
            super.createMenu();
            this.generator = new Utils.Generator();


            $('#game-menu .ui').html(
                '<div><h2>Entrez un login :</h2></div>' +
                '<div><input type="text" class="login-input" value="' + this.generator.generate() + '"/></div>' +
                '<div class="button submit-login"><a>Confirmer</a></div>'
            );

            $('#game-menu .ui .submit-login').bind('click', function (e) {
                self.initChat($('#game-menu .ui .login-input').val());
            });
            $('#game-menu .ui .login-input').on('keyup', function (e) {
                if (e.keyCode == 13) {
                    self.initChat($('#game-menu .ui .login-input').val());
                }
            });
        }

        initChat(login) {
            $('#game-menu .ui').html('');
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
                    self.showFactionSelection();
                    $(this).dialog("close");
                }, function () {
                    self.serverManager.request('DECLINE_DUEL', token);
                    $(this).dialog("close");
                });
            }, function (data) {
                self.showFactionSelection();
            }, function (data) {
                self.game.state.start('mainmultiplayeronline', true, false, data, self.serverManager, self.chatUI);
            });
            this.chatUI = new UI.Chat(this, this.serverManager);
            this.dialogUI = new UI.Dialog(this);
        }

        showFactionSelection() {
            let self = this;
            $('#game-menu .ui').html(
                '<div><h2>Choisissez votre faction :</h2></div>' +
                '<div class="faction-selector">' +
                '   <span class="control left fa fa-chevron-left"></span>' +
                '   <span class="control right fa fa-chevron-right"></span>' +
                '   <div class="faction human"><span class="name">Human</span></div>' +
                '   <div class="faction undead"><span class="name">Undead</span></div>' +
                '</div>' +
                '<div class="button submit-faction"><a>Confirmer</a></div>'
            );

            $('#game-menu .ui .control').on('click', function () {
                $('#game-menu .ui .faction.human').toggle();
                $('#game-menu .ui .faction.undead').toggle();
            });

            $('#game-menu .ui .submit-faction').on('click', function () {
                self.selected_faction = $('#game-menu .ui .faction.human').is(':visible') ? 'human' : 'undead';
                $(this).hide();
                $('#game-menu .ui .control').hide();
                $('#game-menu .ui h2').html('En attente de votre adversaire');
                self.serverManager.request('FACTION_CHOSEN', self.selected_faction);
            });
        }
    }
}
