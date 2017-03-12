module TacticArena.Controller {
    export class LogManager {
        logs;
        game;
        //[
        //    turnIndex: [
        //        stepIndex: {step}
        //    ]
        //]

        constructor(game) {
            this.logs = [];
            this.game = game;
        }

        add(steps) {
            this.logs.push(steps);
        }

        get(turnIndex, stepIndex) {
            return this.logs[turnIndex][stepIndex];
        }
    }
}
