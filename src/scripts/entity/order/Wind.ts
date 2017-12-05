module TacticArena.Order {
    export class Wind extends BaseOrder {

        constructor(position) {
            super('cast_wind', position);
        }

        process(ordermanager: OrderManager, steps: Step[], stepIndex: number, aIndex: number, bIndex: number): BaseOrder {
            let stepUnits = steps[stepIndex].stepUnits;
            let stepUnitA = stepUnits[aIndex];
            let stepUnitB = stepUnits[bIndex];
            stepUnitA.apImpact[stepUnitA.pawn._id] = -2;
            stepUnitA.order.targets = stepUnitA.order.targets || [];
            stepUnitA.hasInteractedWith.push(stepUnitB.pawn._id);
            ordermanager.state.stageManager.getLinearPath(stepUnitA.order.position, 4).forEach( (position: Position) => {
                if (!stepUnitA.order.targets.some(target => {return target.champion === stepUnitB.pawn._id;})) {
                    if(stepUnitB.collidesWith(position)){
                        let movedPosition = (stepUnitB.data.moved !== null) ? stepUnitB.data.moved.clone() : stepUnitB.order.position.clone();
                        if (stepUnitA.order.position.d === 'E') {
                            movedPosition.setX(movedPosition.x + 1);
                        } else if (stepUnitA.order.position.d === 'W') {
                            movedPosition.setX(movedPosition.x - 1);
                        } else if (stepUnitA.order.position.d === 'S') {
                            movedPosition.setY(movedPosition.y + 1);
                        } else if (stepUnitA.order.position.d === 'N') {
                            movedPosition.setY(movedPosition.y - 1);
                        }

                        if (!ordermanager.tileIsFree(stepUnits, movedPosition)) {
                            movedPosition = null;
                        } else {
                            stepUnitB.checked = false;
                        }

                        stepUnitB.data.moved = movedPosition;
                        stepUnitA.order.targets.push({
                            champion: stepUnitB.pawn._id,
                            moved: movedPosition,
                            distance: ordermanager.state.stageManager.getNbTilesBetween(stepUnitA.order.position, stepUnitB.order.position)
                        });
                        stepUnitA.hpImpact[stepUnitB.pawn._id] = -1;
                        ordermanager.pacifyChampion(steps, stepIndex + 1, bIndex, (stepUnitB.data.moved || stepUnitB.order.position));
                    }
                }
            });
            return this;
        }

        resolve(pawn: Champion.BaseChampion, stepUnitData: StepUnitData, previousStep: StepUnit, animate: boolean, backward: boolean, i: number, state): Promise<any> {
            return new Animation.CastWind(state, pawn, this).get();
        }

    }
}
