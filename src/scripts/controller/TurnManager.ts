module TacticArena {
	/*
	Handles turns basic mechanics
	 */
    export class TurnManager {
		state: State.BaseBattle;
		currentTurnIndex: number;
		currentPawn: Entity.Pawn;
		playedPawnsIds: number[];

        constructor(state) {
			this.state = state;
			this.currentTurnIndex = -1;
			this.currentPawn = null;
			this.playedPawnsIds = [];
        }

		/*
		set the pawn as active
		if firstTurnCall, set AP & MP of all pawns, increment turnIndex and reset playedPawnsIds
		 */
        init(pawn, firstTurnCall = false): Promise<boolean> {
            return new Promise((resolve, reject) => {
				if(firstTurnCall) {
					this.state.pawns.forEach((pawn: Entity.Pawn) => {
						pawn.setAp(pawn._apMax);
						pawn.setMp(pawn._mpMax);
					});
					this.currentTurnIndex++;
				}
                this.setActivePawn(pawn);
	        	resolve(true);
        	});
        }

		/*
		 set the current active pawn as played
		 resolve(the next playable pawn)
		 */
        endTurn(): Promise<Entity.Pawn> {
            return new Promise((resolve, reject) => {
				this.playedPawnsIds.push(this.getActivePawn()._id); // set activePawn as played
				let nextPawn = this.getNextPawn();
	        	resolve(nextPawn);
        	});
        }

		/*
		Return current active pawn
		 */
        getActivePawn(): Entity.Pawn {
        	return this.currentPawn;
        }

		/*
		Set parameter pawn as this.currentPawn
		 */
		setActivePawn(pawn: Entity.Pawn): void {
			if(pawn.isAlive() && (!this.getActivePawn() || pawn._id != this.getActivePawn()._id)) {
				this.currentPawn = pawn;
				this.state.signalManager.onActivePawnChange.dispatch(pawn);
			}
		}

		/*
		Return current active player based on current active pawn
		 */
		getActivePlayer(): Player {
			return this.state.players.find( (player: Player) => {
				return player._id === this.currentPawn.team;
			});
		}

		/*
		Return the next playable pawn
		 */
		getNextPawn(): Entity.Pawn {
			return this.state.pawns.find( (pawn: Entity.Pawn) => {
				let isPlayable = this.state.getPlayablePlayers().some( (player: Player) => { return player._id === pawn.team; });
				return pawn.isAlive() && this.playedPawnsIds.indexOf(pawn._id) < 0 && isPlayable;
			});
		}

		reset(): void {
			this.playedPawnsIds = [];
		}
	}
}
