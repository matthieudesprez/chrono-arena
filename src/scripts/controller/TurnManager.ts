module TypescriptPhaser.Controller {
    export class TurnManager {
        players;

        constructor(game) {
            this.players = game.players;         
        }

        initTurn(player) {
            return new Promise((resolve, reject) => {
	        	for(var i = 0; i < this.players.length; i++) {
	        		this.players[i].active = false;
	        	}
	        	player.active = true;
	        	resolve(true);
        	});
        }

        endTurn(player) {
            return new Promise((resolve, reject) => {
	        	var nextIndex = 0;
	        	for(var i = 0; i < this.players.length; i++) {
	        		if(this.players[i].active && (i + 1) < this.players.length) {
	        			nextIndex = i + 1;
	        		}
	        	}
	        	resolve(nextIndex);
        	});
        }

        getActivePlayer() {
        	for(var i = 0; i < this.players.length; i++) {
        		if(this.players[i].active) {
        			return this.players[i];
        		}
        	}
        	return false;
        }
    }
}
