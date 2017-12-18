module TacticArena {
	/*
	Handles turns basic mechanics
	 */
    export class TurnManager {
		state: State.BaseBattle;
		currentPawn: Champion.BaseChampion;
		playedPawnsIds: number[];

        constructor(state) {
			this.state = state;
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
					this.state.pawns.forEach((pawn: Champion.BaseChampion) => {
						pawn.setAp(pawn._apMax);
						pawn.setMp(pawn._mpMax);
					});
				}
                this.setActivePawn(pawn);
	        	resolve(true);
        	});
        }

		/*
		 set the current active pawn as played
		 resolve(the next playable pawn)
		 */
        endTurn(): Promise<Champion.BaseChampion> {
            return new Promise((resolve, reject) => {
				this.playedPawnsIds.push(this.getActivePawn()._id); // set activePawn as played
				let nextPawn = this.getNextPawn();
	        	resolve(nextPawn);
        	});
        }

		/*
		Return current active pawn
		 */
        getActivePawn(): Champion.BaseChampion {
        	return this.currentPawn;
        }

		/*
		Set parameter pawn as this.currentPawn
		 */
		setActivePawn(pawn: Champion.BaseChampion): void {
			if(pawn.isAlive() && (!this.getActivePawn() || pawn._id != this.getActivePawn()._id)) {
				this.currentPawn = pawn;
				this.state.signalManager.onActivePawnChange.dispatch(pawn);
			}
		}

		/*
		Return current active player based on current active pawn
		 */
		getActivePlayer(): Player.BasePlayer {
			return this.state.players.find( (player: Player.BasePlayer) => {
				return player._id === this.currentPawn.team;
			});
		}

		/*
		Return the next playable pawn
		 */
		getNextPawn(): Champion.BaseChampion {
			return this.state.pawns.find( (pawn: Champion.BaseChampion) => {
				let isPlayable = this.state.getPlayablePlayers().some( (player: Player.BasePlayer) => { return player._id === pawn.team; });
				return pawn.isAlive() && this.playedPawnsIds.indexOf(pawn._id) < 0 && isPlayable;
			});
		}

		reset(): void {
			this.playedPawnsIds = [];
		}
	}
}
