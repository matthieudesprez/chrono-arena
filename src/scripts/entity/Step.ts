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

        /*
         Return the champion's hp for this step
         */
        getHp(champion): number {
            let result = 0;
            this.stepUnits.forEach((stepUnit: StepUnit) => {
                result += stepUnit.hpImpact[champion._id] ? stepUnit.hpImpact[champion._id] : 0;
            });
            return result;
        }

        /*
         Return the champion's ap for this step
         */
        getAp(champion): number {
            let result = 0;
            this.stepUnits.forEach((stepUnit: StepUnit) => {
                result += stepUnit.apImpact[champion._id] ? stepUnit.apImpact[champion._id] : 0;
            });
            return result;
        }
    }
}
