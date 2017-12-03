module TacticArena {
    export class Step {
        stepUnits: StepUnit[];

        constructor(stepUnits: StepUnit[] = []) {
            this.stepUnits = stepUnits;
        }

        /*
         Return the champion's stepUnit
         */
        getStepUnit(champion): StepUnit {
            return this.stepUnits.find((stepUnit: StepUnit) => {
                return stepUnit.pawn._id === champion._id;
            });
        }
    }
}
