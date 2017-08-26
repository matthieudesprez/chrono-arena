module TacticArena.Entity {
    export class Step {
        stepUnits:StepUnit[];

        constructor(stepUnits:StepUnit[] = []) {
            this.stepUnits = stepUnits;

        }
    }
}
