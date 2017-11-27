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

        /*
        In case of a pawn having less actions than the others, fill this.orders with Stand orders
         */
        formatOrders() {
            let self = this;
            this.game.pawns.forEach( pawn => {
                if (!self.hasOrder(pawn._id)) {
                    // TODO must be filled with something else, not including the position or direction because it can change if moved by a tornado for example
                    self.add(pawn, new Order.Stand(pawn.getPosition(), pawn.getDirection()), false);
                }
            });
        }

        getInitialStep() {
            var step = new Entity.Step();
            for (var i = 0; i < this.orders.length; i++) {
                let pawn = this.orders[i].entity;
                step.stepUnits.push(new Entity.StepUnit(
                    pawn,
                    new Entity.StepUnitData((pawn.getHp() > 0 ? pawn._apMax : 0), pawn.getHp()),
                    (pawn.getHp() <= 0) ? new Order.Dead(pawn.getPosition(), pawn.getDirection()) : new Order.Stand(pawn.getPosition(), pawn.getDirection())
                ));
            }
            return step;
        }

        static resolutionEsquive(fleeRate) {
            return (Math.floor(Math.random() * 100) > fleeRate);
        }

        blockEntity(steps, startI, j, order, entity) {
            steps[startI].stepUnits[j].data.positionBlocked = steps[startI].stepUnits[j].order.position;
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
                    steps[j].stepUnits.push( new Entity.StepUnit(
                        pawn,
                        new Entity.StepUnitData(),
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

        tileIsFree(stepUnits:Entity.StepUnit[], position:Position) {
            for (var i = 0; i < stepUnits.length; i++) {
                if (
                    (typeof stepUnits[i].data.moved === 'undefined' && position.equals(stepUnits[i].order.position)) ||
                    (stepUnits[i].data.moved && stepUnits[i].data.moved.equals(position))) {
                    return false;
                }
            }
            return true;
        }

        processOrders(steps:Entity.Step[]) {
            for (var l = 1; l < steps.length; l++) {
                var stepUnits = steps[l].stepUnits;
                let previousStepUnit = steps[l - 1].stepUnits;
                for (var i = 0; i < stepUnits.length; i++) {
                    stepUnits[i].data = new Entity.StepUnitData(previousStepUnit[i].data.ap, previousStepUnit[i].data.hp);
                    // In case a pawn has less actions to play than the others he got a default one but if he has 0 AP he won't do anything
                    if (stepUnits[i].order == null) { stepUnits[i].order = new Order.Stand(previousStepUnit[i].order.position, previousStepUnit[i].order.direction); }
                }

                // check actions for each entity in step
                for (var i = 0; i < stepUnits.length; i++) {
                    // foreach entities except A
                    for (var j = 0; j < stepUnits.length; j++) {
                        if (stepUnits[i].pawn._id == stepUnits[j].pawn._id) continue; // Pas d'interaction avec soi-même

                        let positionBBeforeOrder = previousStepUnit[j].data.moved ? previousStepUnit[j].data.moved : previousStepUnit[j].order.position;

                        stepUnits[i].data.aWasFacingB = previousStepUnit[i].order.position.faces(positionBBeforeOrder, previousStepUnit[i].order.direction);
                        stepUnits[i].data.aWasNextToB = previousStepUnit[i].order.position.getDistanceFrom(positionBBeforeOrder) == 1;
                        stepUnits[i].data.entityAApCost = 1;
                        stepUnits[i].data.entityBHpLost = 0;
                        stepUnits[i].data.aIsActive = previousStepUnit[i].data.ap > 0; // INACTIF = stand mais pas le droit d'attaquer
                        stepUnits[i].data.aIsAlive = previousStepUnit[i].data.hp > 0;
                        stepUnits[i].data.keepDirection = (previousStepUnit[i].order.direction == stepUnits[i].order.direction);
                        stepUnits[i].data.keepPosition = stepUnits[i].order.position.equals(previousStepUnit[i].order.position);
                        stepUnits[i].data.equalPositions = stepUnits[i].order.position.equals(stepUnits[j].order.position);
                        stepUnits[i].data.differentTeams = stepUnits[i].pawn.team != stepUnits[j].pawn.team;
                        stepUnits[i].data.alteredEntityB = this.alteredPawns.indexOf(stepUnits[j].pawn._id) < 0;
                        stepUnits[i].data.positionBBeforeOrder = positionBBeforeOrder;

                        stepUnits[i].data.hp = typeof stepUnits[i].data.hp !== 'undefined' ? stepUnits[i].data.hp : previousStepUnit[i].data.hp;

                        if (!stepUnits[i].data.aIsAlive) {
                            stepUnits[i].order = new Order.Dead(previousStepUnit[i].order.position, previousStepUnit[i].order.direction);
                            stepUnits[i].data.ap = previousStepUnit[i].data.ap;
                            stepUnits[i].data.hp = 0;
                            previousStepUnit[i].data.dies = !(previousStepUnit[i].order instanceof Order.Dead);
                            continue;
                        }

                        if (stepUnits[i].data.equalPositions) {
                            // Si A veut aller sur la même case que B (qu'il y soit déjà statique où qu'il veuille y aller)
                            if (this.alteredPawns.indexOf(stepUnits[i].pawn._id) < 0) stepUnits[i].data.moveHasBeenBlocked = stepUnits[i].order instanceof Order.Move;
                            if (this.alteredPawns.indexOf(stepUnits[j].pawn._id) < 0) stepUnits[j].data.moveHasBeenBlocked = stepUnits[j].order instanceof Order.Move;
                        }

                        stepUnits[i].order = stepUnits[i].order.process(this, steps, l, i, j);

                        stepUnits[j].data.hp -= stepUnits[i].data.entityBHpLost;
                        stepUnits[i].data.ap = stepUnits[i].data.aIsActive ? previousStepUnit[i].data.ap - stepUnits[i].data.entityAApCost : 0;

                        if (stepUnits[i].data.moveHasBeenBlocked && this.alteredPawns.indexOf(stepUnits[i].pawn._id) < 0) {
                            this.blockEntity(steps, l, i, new Order.Stand(previousStepUnit[i].order.position, previousStepUnit[i].order.direction), stepUnits[i].pawn);
                        }
                        if (stepUnits[j].data.moveHasBeenBlocked && this.alteredPawns.indexOf(stepUnits[j].pawn._id) < 0) {
                            this.blockEntity(steps, l, j, new Order.Stand(previousStepUnit[j].order.position, previousStepUnit[j].order.direction), stepUnits[j].pawn);
                        }
                    }
                }
            }
            return steps;
        }
    }
}
