module TacticArena.Controller {
    export class TurnManager {
		currentTurnIndex;
		currentTeam;
		game;

        constructor(game) {
			this.game = game;
			this.currentTurnIndex = -1;
        }

        init(pawn, firstTurnCall = false) {
            return new Promise((resolve, reject) => {
				if(firstTurnCall) {
					for (var i = 0; i < this.game.pawns.length; i++) {
						this.game.pawns[i].setAp(3);
						this.game.pawns[i].ghost = null;
					}
					this.currentTurnIndex++;
				}
                this.setActivePawn(pawn);
	        	resolve(true);
        	});
        }

        endTurn() {
            return new Promise((resolve, reject) => {
	        	var nextIndex = 0;
	        	for(var i = 0; i < this.game.pawns.length; i++) {
	        		if(this.game.pawns[i].active && (i + 1) < this.game.pawns.length) {
	        			nextIndex = i + 1;
	        		}
	        	}
	        	resolve(this.game.pawns[nextIndex]);
        	});
        }

        getActivePawn():Entity.Pawn {
        	for(var i = 0; i < this.game.pawns.length; i++) {
        		if(this.game.pawns[i].active) {
        			return this.game.pawns[i];
        		}
        	}
        	return null;
        }

		setActivePawn(pawn) {
			for(var i = 0; i < this.game.pawns.length; i++) {
				this.game.pawns[i].active = (this.game.pawns[i]._id == pawn._id);
			}
			this.currentTeam = pawn.team;
			this.game.signalManager.onActivePawnChange.dispatch(pawn);
		}
	}
}
