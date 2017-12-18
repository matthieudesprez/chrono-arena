module TacticArena {
    import BaseBattle = TacticArena.State.BaseBattle;
    export class LogManager {
        logs: Step[][];
        game: State.BaseBattle;

        constructor(game) {
            this.logs = [];
            this.game = game;
        }

        add(steps): void {
            this.logs.push(steps);
        }

        get(turnIndex): Step[] {
            return turnIndex < this.logs.length ? this.logs[turnIndex] : null;
        }
    }
}
