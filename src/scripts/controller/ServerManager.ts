module TacticArena.Controller {
    export class ServerManager {
        game;
        socket;

        constructor(game) {
            this.game = game;
            this.connect();
        }

        connect() {
            this.socket = new WebSocket('ws://localhost:3000');
            this.socket.onmessage = function (message) {
                console.log('Connection 1', message.data);
            };
            this.send(JSON.stringify({name: 'Bob', message: 'Hello'}));
        }

        send(message, callback = null) {
            var self = this;
            this.waitForConnection(function () {
                self.socket.send(message);
                if (typeof callback === "function") {
                    callback();
                }
            }, 1000);
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
