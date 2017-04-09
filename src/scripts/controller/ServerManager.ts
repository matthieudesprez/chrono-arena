module TacticArena.Controller {
    export class ServerManager {
        game;
        socket;
        url;

        constructor(game) {
            this.game = game;
            this.url = 'wss://polar-fortress-51758.herokuapp.com'; //'ws://localhost:3000'
            this.connect();
        }

        connect() {
            let self = this;
            this.socket = new WebSocket(this.url);
            this.socket.onmessage = function (message) {
                console.log('Connection 1', message.data);
                self.game.signalManager.onChatMessageReception.dispatch(JSON.parse(message.data).data);
            };
            this.send(JSON.stringify({name: 'Chrono', message: 'Hello !'})).then( (res) => {

            });
        }

        send(message, callback = null) {
            var self = this;
            return new Promise((resolve, reject) => {
                self.waitForConnection(function () {
                    self.socket.send(message);
                    if (typeof callback === "function") {
                        callback();
                    }
                    resolve(true);
                }, 1000);
            });
        }

        waitForConnection(callback, interval) {
            if (this.socket.readyState === 1) {
                callback();
            } else {
                var that = this;
                // optional: implement backoff for interval here
                setTimeout(function () {
                    that.waitForConnection(callback, interval);
                }, interval);
            }
        };
    }
}
