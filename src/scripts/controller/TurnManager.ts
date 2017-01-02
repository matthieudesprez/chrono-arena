module TacticArena.Controller {
    export class TurnManager {
        pawns;

        constructor(game) {
            this.pawns = game.pawns;         
        }

        initTurn(pawn) {
            return new Promise((resolve, reject) => {
	        	for(var i = 0; i < this.pawns.length; i++) {
	        		this.pawns[i].active = false;
	        	}
                pawn.active = true;
	        	pawn.ap = 2;
				pawn.stunned = false;
				pawn.isHurt = false;
				pawn.isAttacking = false;
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
