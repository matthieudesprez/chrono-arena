module TacticArena.Controller {
    export class ServerManager {
        game;
        socket;
        url;
        login;
        token;
        socketId;
        playersList;
        onChatMessageReceptionCallback;
        onPlayersListUpdateCallback;
        intervalCount;

        constructor(game, login, onChatMessageReceptionCallback, onPlayersListUpdateCallback) {
            this.game = game;
            //this.url = 'wss://polar-fortress-51758.herokuapp.com';
            this.url = 'ws://localhost:3000';
            this.login = login;
            this.token = '';
            this.socketId = null;
            this.playersList = [];
            this.onChatMessageReceptionCallback = onChatMessageReceptionCallback;
            this.onPlayersListUpdateCallback = onPlayersListUpdateCallback;
            this.intervalCount = 0;
            this.connect();
            this.notifyNewConnection(this.login);
        }

        connect() {
            let self = this;
            this.socket = new WebSocket(this.url);
            this.socket.onmessage = function (message) {
                console.log(message.data);
                let data = JSON.parse(message.data).data;
                let server_msg = data.type == 'SERVER_NOTIFICATION';
                if(data.type == 'SERVER_PLAYERS_LIST') {
                    self.onPlayersListUpdateCallback(data);
                } else {
                    self.onChatMessageReceptionCallback(data, server_msg);
                }
            };
            this.socket.onclose = function (e) {
                console.log('close', e);
            };
            this.socket.onerror = function (e) {
                console.log('error', e);
            };
            this.socket.onopen = function (e) {
                console.log('open', e);
            };
            //self.send({name: 'Chrono', content: 'Hello !'}).then( (res) => {
            //
            //});
            $(window).on('beforeunload', function() {
                console.log('disconnect');
                self.socket.close();
                //return null;
            });
        }

        send(message, callback = null) {
            var self = this;
            return new Promise((resolve, reject) => {
                self.waitForConnection(function () {
                    self.socket.send(JSON.stringify(message));
                    if (typeof callback === "function") {
                        callback();
                    }
                    resolve(true);
                }, 1000);
            });
        }

        waitForConnection(callback, interval) {
            if (this.socket.readyState === 1) {
                this.intervalCount = 0;
                callback();
            } else {
                this.intervalCount++;
                var that = this;
                // optional: implement backoff for interval here
                if(this.intervalCount > 2) {
                    this.intervalCount = 0;
                    this.connect();
                } else {
                    setTimeout(function () {
                        that.waitForConnection(callback, interval);
                    }, interval);
                }
            }
        };

        notifyNewConnection(name) {
            console.log(name);
            this.send({type: 'NEW_CONNECTION', name: name, content: ' '}).then( (res) => {

            });
        }
    }
}
