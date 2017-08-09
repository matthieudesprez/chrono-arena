module TacticArena {
    export class OrderManager {
        orders;
        game;
        alteredPawns;

        constructor(game) {
            this.orders = [];
            this.game = game;
            this.alteredPawns = [];
        }

        removeEntityOrder(pawn) {
            let id = pawn._id;
            var result = [];
            for (var i = 0; i < this.orders.length; i++) {
                if (this.orders[i].entity._id != id) {
                    result.push(this.orders[i]);
                }
            }
            this.orders = result;
            this.game.signalManager.onOrderChange.dispatch(pawn);
        }

        hasOrder(id) {
            for (var i = 0; i < this.orders.length; i++) {
                if (this.orders[i].entity._id == id) {
                    return true;
                }
            }
            return false;
        }

        add(entity, order, triggerDispatch = true) {
            if (!this.hasOrder(entity._id)) {
                this.orders.push({entity: entity, list: []});
            }
            for (var i = 0; i < this.orders.length; i++) {
                if (this.orders[i].entity._id == entity._id) {
                    this.orders[i].list.push(order);
                }
            }
            if (triggerDispatch) {
                this.game.signalManager.onOrderChange.dispatch(entity);
            }
        }

        getOrders(entity_id) {
            for (var i = 0; i < this.orders.length; i++) {
                if (this.orders[i].entity._id == entity_id) {
                    return this.orders[i].list;
                }
            }
            return [];
        }

        getPlayerOrders(teamId) {
            let result = [];
            for (var i = 0; i < this.orders.length; i++) {
                if (this.orders[i].entity.team == teamId) {
                    result.push({
                        entityId: this.orders[i].entity._id,
                        list: this.orders[i].list
                    });
                }
            }
            return result;
        }

        getMaxOrderListLength() {
            var max = 0;
            for (var i = 0; i < this.orders.length; i++) {
                if (this.orders[i].list.length > max) {
                    max = this.orders[i].list.length;
                }
            }
            return max;
        }

        formatOrders() {
            for (var i = 0; i < this.game.pawns.length; i++) {
                let p = this.game.pawns[i];
                if (!this.hasOrder(p._id)) {
                    let position = p.getPosition();
                    this.add(p, new Order.Stand(position, p.getDirection()), false);
                }
            }
        }

        getInitialStep() {
            var step = new Entity.Step();
            for (var i = 0; i < this.orders.length; i++) {
                let pawn = this.orders[i].entity;
                step.stepUnits.push(new Entity.StepUnit(
                    pawn,
                    new Entity.StepUnitState((pawn.getHp() > 0 ? pawn._apMax : 0), pawn.getHp()),
                    (pawn.getHp() <= 0) ? new Order.Dead(pawn.getPosition(), pawn.getDirection()) : new Order.Stand(pawn.getPosition(), pawn.getDirection())
                ));
            }
            return step;
        }

        static resolutionEsquive(fleeRate) {
            return (Math.floor(Math.random() * 100) > fleeRate);
        }

        blockEntity(steps, startI, j, order, entity) {
            steps[startI].stepUnits[j].stepUnitState.positionBlocked = steps[startI].stepUnits[j].order.position;
            for (var i = startI; i < steps.length; i++) {
                if (steps[i].stepUnits[j].order) {
                    if (i > startI && steps[i].stepUnits[j].order.action == 'move') {
                        steps[i].stepUnits[j].order = order;
                    }
                    steps[i].stepUnits[j].order.position = order.position;
                }
            }
            this.alteredPawns.push(entity._id);
            entity.destroyProjection();
            return steps;
        }

        pacifyEntity(steps, startI, j, order, entity, state) {
            for (var i = startI; i < steps.length; i++) {
                steps[i].stepUnits[j].order = new TacticArena.Order.Stand(
                    new Position(state.moved.x, state.moved.y),
                    order.direction
                );
            }
            this.alteredPawns.push(entity._id);
            entity.destroyProjection();
            return steps;
        }

        getSteps() {
            this.alteredPawns = [];
            this.formatOrders();
            let steps = new Array(this.getMaxOrderListLength());
            for (var j = 0; j < steps.length; j++) {
                steps[j] = new Entity.Step();
                for (var i = 0; i < this.orders.length; i++) {
                    var pawn = this.orders[i].entity;
                    pawn.show(); // TODO ugly
                    steps[j].stepUnits.push( new Entity.StepUnit(
                        pawn,
                        new Entity.StepUnitState(),
                        this.orders[i].list[j] ? this.orders[i].list[j] : null
                    ));
                }
            }
            steps.unshift(this.getInitialStep());
            this.orders = [];
            return this.processOrders(steps);
        }

        getPawn(id) {
            let result = null;
            this.game.pawns.forEach(p => {
                if (p._id == id) {
                    result = p;
                }
            });
            return result;
        }

        tileIsFree(stepUnit:Entity.StepUnit, position:Position) {
            // TODO ça devrait pas marcher
            for (var i = 0; i < stepUnit.length; i++) {
                let stepUnitState = stepUnit[i].stepUnitState;
                let order = stepUnit[i].order;
                if ((typeof stepUnitState.moved === 'undefined' && position.equals(order.position)) || (stepUnitState.moved && stepUnitState.moved.equals(position))) {
                    return false;
                }
            }
            return true;
        }

        processOrders(steps:Entity.Step[]) {
            for (var l = 1; l < steps.length; l++) {
                var stepUnit = steps[l].stepUnits;
                let previousStepUnit = steps[l - 1].stepUnits;
                for (var i = 0; i < stepUnit.length; i++) {
                    stepUnit[i].stepUnitState = new Entity.StepUnitState(previousStepUnit[i].stepUnitState.ap, previousStepUnit[i].stepUnitState.hp);
                    // In case a pawn has less actions to play than the others he got a default one but if he has 0 AP he won't do anything
                    if (stepUnit[i].order == null) { stepUnit[i].order = new Order.Stand(previousStepUnit[i].order.position, previousStepUnit[i].order.direction); }
                }

                // check actions for each entity in step
                for (var i = 0; i < stepUnit.length; i++) {
                    // foreach entities except A
                    for (var j = 0; j < stepUnit.length; j++) {
                        if (stepUnit[i].pawn._id == stepUnit[j].pawn._id) continue; // Pas d'interaction avec soi-même

                        let positionBBeforeOrder = previousStepUnit[j].stepUnitState.moved ? previousStepUnit[j].stepUnitState.moved : previousStepUnit[j].order.position;

                        stepUnit[i].data = {
                            aWasFacingB: previousStepUnit[i].order.position.faces(positionBBeforeOrder, previousStepUnit[i].order.direction),
                            aWasNextToB: previousStepUnit[i].order.position.getDistanceFrom(positionBBeforeOrder) == 1,
                            fleeRate: 50,
                            entityAApCost: 1,
                            entityBHpLost: 0,
                            aIsActive: previousStepUnit[i].stepUnitState.ap > 0, // INACTIF = stand mais pas le droit d'attaquer
                            aIsAlive: previousStepUnit[i].stepUnitState.hp > 0,
                            keepDirection: (previousStepUnit[i].order.direction == stepUnit[i].order.direction),
                            keepPosition: stepUnit[i].order.position.equals(previousStepUnit[i].order.position),
                            equalPositions: stepUnit[i].order.position.equals(stepUnit[j].order.position),
                            differentTeams: stepUnit[i].pawn.team != stepUnit[j].pawn.team,
                            alteredEntityB: this.alteredPawns.indexOf(stepUnit[j].pawn._id) < 0,
                            positionBBeforeOrder: positionBBeforeOrder,
                            l: l,
                            j: j
                        };

                        stepUnit[i].stepUnitState.hp = typeof stepUnit[i].stepUnitState.hp !== 'undefined' ? stepUnit[i].stepUnitState.hp : previousStepUnit[i].stepUnitState.hp;

                        if (!stepUnit[i].data.aIsAlive) {
                            stepUnit[i].order = new Order.Dead(previousStepUnit[i].order.position, previousStepUnit[i].order.direction);
                            stepUnit[i].stepUnitState.ap = previousStepUnit[i].stepUnitState.ap;
                            stepUnit[i].stepUnitState.hp = 0;
                            previousStepUnit[i].stepUnitState.dies = !(previousStepUnit[i].order instanceof Order.Dead);
                            continue;
                        }

                        if (stepUnit[i].data.equalPositions) {
                            // Si A veut aller sur la même case que B (qu'il y soit déjà statique où qu'il veuille y aller)
                            if (this.alteredPawns.indexOf(stepUnit[i].pawn._id) < 0) stepUnit[i].stepUnitState.moveHasBeenBlocked = stepUnit[i].order instanceof Order.Move;
                            if (this.alteredPawns.indexOf(stepUnit[j].pawn._id) < 0) stepUnit[j].stepUnitState.moveHasBeenBlocked = stepUnit[j].order instanceof Order.Move;
                        }

                        stepUnit[i].order = stepUnit[i].order.process(stepUnit[i], stepUnit[j], this, steps);

                        stepUnit[j].stepUnitState.hp -= stepUnit[i].data.entityBHpLost;
                        stepUnit[i].stepUnitState.ap = stepUnit[i].data.aIsActive ? previousStepUnit[i].stepUnitState.ap - stepUnit[i].data.entityAApCost : 0;

                        if (stepUnit[i].stepUnitState.moveHasBeenBlocked && this.alteredPawns.indexOf(stepUnit[i].pawn._id) < 0) {
                            this.blockEntity(steps, l, i, new Order.Stand(previousStepUnit[i].order.position, previousStepUnit[i].order.direction), stepUnit[i].pawn);
                        }
                        if (stepUnit[j].stepUnitState.moveHasBeenBlocked && this.alteredPawns.indexOf(stepUnit[j].pawn._id) < 0) {
                            this.blockEntity(steps, l, j, new Order.Stand(previousStepUnit[j].order.position, previousStepUnit[j].order.direction), stepUnit[j].pawn);
                        }
                    }
                }
            }
            return steps;
        }
    }
}
