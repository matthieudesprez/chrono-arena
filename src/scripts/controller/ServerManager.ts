module TacticArena {
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
        onDuelAskReceptionCallback;
        onDuelAcceptedCallback;
        onDuelStartCallback;
        intervalCount;

        constructor(game, login, onChatMessageReceptionCallback, onPlayersListUpdateCallback, onDuelAskReceptionCallback, onDuelAcceptedCallback, onDuelStartCallback) {
            this.game = game;
            this.url = 'wss://polar-fortress-51758.herokuapp.com';
            //this.url = 'ws://localhost:3000';
            this.login = login;
            this.token = '';
            this.socketId = null;
            this.playersList = [];
            this.onChatMessageReceptionCallback = onChatMessageReceptionCallback;
            this.onPlayersListUpdateCallback = onPlayersListUpdateCallback;
            this.onDuelAskReceptionCallback = onDuelAskReceptionCallback;
            this.onDuelAcceptedCallback = onDuelAcceptedCallback;
            this.onDuelStartCallback = onDuelStartCallback;
            this.intervalCount = 0;
            this.connect();
            this.request('NEW_CONNECTION', ' ', this.login);
        }

        connect() {
            let self = this;
            this.socket = new WebSocket(this.url);
            this.socket.onmessage = function (message) {
                let data = JSON.parse(message.data).data;
                console.log(data);
                let server_msg = data.type == 'SERVER_NOTIFICATION';
                if(data.type == 'SERVER_PLAYERS_LIST') {
                    self.onPlayersListUpdateCallback(data);
                } else if (data.type == 'SERVER_TOKEN') {
                    self.token = data.content;
                } else if (data.type == 'ASK_DUEL') {
                    self.onDuelAskReceptionCallback(data.content, data.name);
                } else if (data.type == 'DECLINE_DUEL') {
                    self.onChatMessageReceptionCallback(data, true);
                } else if (data.type == 'ACCEPT_DUEL') {
                    self.onChatMessageReceptionCallback(data, true);
                    self.onDuelAcceptedCallback(data);
                } else if (data.type == 'START_DUEL') {
                    self.onChatMessageReceptionCallback({content: 'Début du duel'}, true);
                    self.onDuelStartCallback(data);
                } else if (data.type == 'PROCESS_ORDERS') {
                    let orders = [];
                    for(var i = 0; i < data.content.length; i++) {
                        if(data.content[i].orders) {
                            for (var j = 0; j < data.content[i].orders.length; j++) {
                                if(data.content[i].orders[j].championId) {
                                    data.content[i].orders[j].champion = self.game.getChampion(data.content[i].orders[j].championId);
                                }
                                orders = orders.concat(data.content[i].orders[j]);
                            }
                        }
                    }
                    self.game.orderManager.orders = orders;
                    let steps = self.game.orderManager.getSteps();
                    let serializedSteps = [];
                    for(var i = 0; i < steps.length; i++) {
                        serializedSteps.push([]);
                        for (var j = 0; j < steps[i].length; j++) {
                            let s = {
                                championId: steps[i].stepUnits[j].pawn._id,
                                stepUnitState: steps[i].stepUnits[j].stepUnitData,
                                order: steps[i].stepUnits[j].order,
                            };
                            serializedSteps[i].push(s);
                        }
                    }
                    self.request('PROCESSED_ORDERS', serializedSteps);
                } else if (data.type == 'PROCESSED_ORDERS') {
                    let serializedSteps = data.content;
                    let steps = [];
                    for(var i = 0; i < serializedSteps.length; i++) {
                        steps.push([]);
                        for (var j = 0; j < serializedSteps[i].length; j++) {
                            let s = {
                                champion: self.game.pawns.find( o => { return o._id == serializedSteps[i].stepUnits[j].championId; }),
                                stepUnitState: serializedSteps[i].stepUnits[j].stepUnitData,
                                order: serializedSteps[i].stepUnits[j].order,
                            };
                            steps[i].push(s);
                        }
                    }
                    self.game.signalManager.onProcessedOrders.dispatch(steps);
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
                setInterval(function(){
                    self.request('KEEP_ALIVE', 'keep me alive');
                }, 30000);
            };

            //$(window).on('beforeunload', function() {
            //    console.log('disconnect');
            //    self.socket.close();
            //});
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

        request(type, content, name=null) {
            var self = this;
            this.send({type: type, name: (name ? name : self.token), content: content}).then( (res) => {

            });
        }
    }
}
