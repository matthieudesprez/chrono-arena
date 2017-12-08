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
            ordermanager.state.stageManager.getLinearPath(stepUnitA.order.position, 4).forEach((position: Position) => {
                if (!stepUnitA.order.targets.some(target => {return target.champion === stepUnitB.pawn._id && target.moved !== null;}) || stepUnitB.data.moveHasBeenBlocked) {
                    if (stepUnitB.collidesWith(position)) {
                        let movedPosition = stepUnitB.data.moveHasBeenBlocked ? stepUnitB.order.position.clone() : stepUnitB.getPosition().clone();
                        if(stepUnitB.data.moveHasBeenBlocked) {
                            stepUnitB.data.moved = null;
                        }
                        movedPosition.moves(stepUnitA.order.position.d, 1);

                        if (!ordermanager.tileIsFree(stepUnits, movedPosition)) {
                            movedPosition = null;
                        }
                        stepUnitB.checked = false;

                        // TODO maybe should directly modify stepUnitB.order.position = movedPosition
                        stepUnitB.data.moved = movedPosition;
                        stepUnitA.order.targets = stepUnitA.order.targets.filter(target => {
                            return target.champion !== stepUnitB.pawn._id;
                        });
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

        resolve(pawn: Champion.BaseChampion, stepUnit: StepUnit, animate: boolean, state): Promise<any> {
            return new Animation.CastWind(state, pawn, this, stepUnit).get();
        }

    }
}
