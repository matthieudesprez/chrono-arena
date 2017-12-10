module TacticArena.Order {
    export class Wind extends BaseOrder {

        constructor(position) {
            super('cast_wind', position);
        }

        process(ordermanager: OrderManager, steps: Step[], stepIndex: number, aIndex: number, bIndex: number): void {
            let stepUnits: StepUnit[] = steps[stepIndex].stepUnits;
            let stepUnitA: StepUnit = stepUnits[aIndex];
            let stepUnitB: StepUnit = stepUnits[bIndex];
            stepUnitA.apImpact[stepUnitA.pawn._id] = -2;
            ordermanager.state.stageManager.getLinearPath(stepUnitA.order.position, 4).forEach((position: Position) => {
                if (!stepUnitA.targets(stepUnitB.pawn) || !stepUnitB.isMoved()) {
                    if (position.equalsOne([stepUnitB.movedPosition, stepUnitB.order.position])) {
                        let movedPosition = stepUnitB.getPosition().clone();
                        movedPosition.moves(stepUnitA.order.position.d, 1);

                        if (!ordermanager.tileIsFree(stepUnits, movedPosition)) { movedPosition = null; }
                        stepUnitB.checked = false;

                        stepUnitB.movedPosition = movedPosition;
                        stepUnitA.order.targets = stepUnitA.order.targets.filter(target => { return target.championId !== stepUnitB.pawn._id; });
                        stepUnitA.order.targets.push({
                            championId: stepUnitB.pawn._id,
                            moved: movedPosition,
                            distance: ordermanager.state.stageManager.getNbTilesBetween(stepUnitA.order.position, stepUnitB.order.position)
                        });
                        stepUnitA.hpImpact[stepUnitB.pawn._id] = -1;

                        //ordermanager.pacifyChampion(steps, stepIndex + 1, bIndex, (stepUnitB.movedPosition || stepUnitB.order.position));
                        if(stepUnitB.isMoved()) {
                            ordermanager.translateOrders(steps, stepIndex + 1, bIndex, movedPosition.substract(stepUnitB.order.position));
                        }
                    }
                }
            });
        }

        resolve(pawn: Champion.BaseChampion, stepUnit: StepUnit, animate: boolean, state): Promise<any> {
            return new Animation.CastWind(state, pawn, this, stepUnit).get();
        }

    }
}
