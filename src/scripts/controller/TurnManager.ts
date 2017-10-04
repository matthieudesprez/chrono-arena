module TacticArena {
    export class TurnManager {
		currentTurnIndex;
		currentTeam;
		playedPawns;
		game;

        constructor(game) {
			this.game = game;
			this.currentTurnIndex = -1;
			this.playedPawns = [];
        }

        init(pawn, firstTurnCall = false) {
            return new Promise((resolve, reject) => {
				if(firstTurnCall) {
					this.game.pawns.forEach((pawn) => {
						pawn.setAp(pawn._apMax);
						pawn.setMp(pawn._mpMax);
						pawn.ghost = null;
					});
					this.currentTurnIndex++;
					this.playedPawns = [];
				}
                this.setActivePawn(pawn);
	        	resolve(true);
        	});
        }

		getRemainingPawns(teamId = null) {
			return this.game.pawns.filter((pawn) => {
				let condition = pawn.isAlive() && this.playedPawns.indexOf(pawn._id) < 0;
				if (teamId !== null) { condition = condition && pawn.team == teamId; }
				return condition;
			});
		}

        endTurn() {
            return new Promise((resolve, reject) => {
				this.setActivePawnAsPlayed();
				var nextPawn;
				let remainingPawns = this.getRemainingPawns();
				if(remainingPawns.length > 0) {
					nextPawn = remainingPawns[0];
					if(nextPawn.team != this.currentTeam) {
						this.game.signalManager.onTeamChange.dispatch();
					}
				}
	        	resolve(nextPawn);
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
			let activePawn = this.getActivePawn();
			if(pawn.isAlive() && (!activePawn || pawn._id != activePawn._id)) {
				for (var i = 0; i < this.game.pawns.length; i++) {
					this.game.pawns[i].active = (this.game.pawns[i]._id == pawn._id);
				}
				this.currentTeam = pawn.team;
				this.game.signalManager.onActivePawnChange.dispatch(pawn);
			}
		}

		setActivePawnAsPlayed() {
			this.playedPawns.push(this.getActivePawn()._id);
		}
	}
}
