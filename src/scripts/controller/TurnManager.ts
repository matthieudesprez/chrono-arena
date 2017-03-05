module TacticArena.Controller {
    export class TurnManager {
        pawns;
		currentTurnIndex;

        constructor(game) {
            this.pawns = game.pawns;
			this.currentTurnIndex = -1;
        }

        init(pawn, firstTurnCall = false) {
            return new Promise((resolve, reject) => {
	        	for(var i = 0; i < this.pawns.length; i++) {
	        		this.pawns[i].active = false;
                    //distribution des ap va se faire à chaque début de tour
					if(firstTurnCall) {
						this.pawns[i].setAp(3);
                        this.pawns[i].stunned = false;
                        this.pawns[i].isHurt = false;
                        this.pawns[i].isAttacking = false;
                        this.pawns[i].hasAttacked = false;
                        this.pawns[i].ghost = null;
					}
	        	}
				if(firstTurnCall) {
					console.log(firstTurnCall);
					this.currentTurnIndex++;
				}
                pawn.active = true;
	        	resolve(true);
        	});
        }

        endTurn() {
            return new Promise((resolve, reject) => {
	        	var nextIndex = 0;
	        	for(var i = 0; i < this.pawns.length; i++) {
	        		if(this.pawns[i].active && (i + 1) < this.pawns.length) {
	        			nextIndex = i + 1;
	        		}
	        	}
	        	resolve(this.pawns[nextIndex]);
        	});
        }

        getActivePawn():Entity.Pawn {
        	for(var i = 0; i < this.pawns.length; i++) {
        		if(this.pawns[i].active) {
        			return this.pawns[i];
        		}
        	}
        	return null;
        }
    }
}
