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

        add(action, entity, x, y, direction = null, triggerDispatch = true, order = null) {
            if (!this.hasOrder(entity._id)) {
                this.orders.push({ entity: entity, list: [] });
            }
            for (var i = 0; i < this.orders.length; i++) {
                if (this.orders[i].entity._id == entity._id) {
                    if(order === null) { order = new BaseOrder(action,  new Position(x, y), direction); }
                    this.orders[i].list.push(order);
                }
            }
            if(triggerDispatch) { this.game.signalManager.onOrderChange.dispatch(entity); }
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
                    this.add('stand', p, position.x, position.y, p.getDirection(), false, new Order.Stand(position, p.getDirection()));
                }
            }
        }

        getInitialStep() {
            var step = [];
            for (var i = 0; i < this.orders.length; i++) {
                let state = OrderManager.getDefaultEntityState();
                let pawn = this.orders[i].entity;
                let hp = pawn.getHp();
                state['ap'] = hp > 0 ? pawn._apMax : 0;
                state['hp'] = hp;
                let defaultOrder = new Order.Stand(pawn.getPosition(), pawn.getDirection());
                if(hp <= 0) defaultOrder.action = 'dead';
                step.push({
                    entity: pawn,
                    entityState: state,
                    order: defaultOrder
                });
            }
            return step;
        }

        static resolutionEsquive(fleeRate) {
            return (Math.floor(Math.random() * 100) > fleeRate);
        }

        blockEntity(steps, startI, j, order, entity) {
            steps[startI][j].entityState.positionBlocked = {x: steps[startI][j].order.position.x, y: steps[startI][j].order.position.y};
            for (var i = startI; i < steps.length; i++) {
                if (steps[i][j].order) {
                    if (i > startI && steps[i][j].order.action == 'move') {
                        steps[i][j].order = order;
                    }
                    steps[i][j].order.position = order.position;
                }
            }
            this.alteredPawns.push(entity._id);
            entity.destroyProjection();
            return steps;
        }

        pacifyEntity(steps, startI, j, order, entity, state) {
            for (var i = startI; i < steps.length; i++) {
                steps[i][j].order = new TacticArena.Order.Stand(
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
                steps[j] = [];
                for (var i = 0; i < this.orders.length; i++) {
                    var entity = this.orders[i].entity;
                    entity.show();
                    steps[j].push({
                        entity: entity,
                        order: this.orders[i].list[j] ? this.orders[i].list[j] : null
                    });
                }
            }
            steps.unshift(this.getInitialStep());
            this.orders = [];
            console.log(steps);
            return this.processOrders(steps);
        }

        static getDefaultEntityState() {
            return {
                moveHasBeenBlocked: false,
                positionBlocked: {}
            };
        }

        getPawn(id) {
            let result = null;
            this.game.pawns.forEach( p => {
                if(p._id == id) {
                    result = p;
                }
            });
            return result;
        }

        tileIsFree(step, position:Position) {
            for (var i = 0; i < step.length; i++) {
                let entityState = step[i].entityState;
                let order = step[i].order;
                if((typeof entityState.moved === 'undefined' && position.equals(order.position)) || (entityState.moved && entityState.moved.equals(position))) {
                    return false;
                }
            }
            return true;
        }

        processOrders(steps) {
            for (var l = 1; l < steps.length; l++) {
                var step = steps[l];
                let previousStep = steps[l - 1];
                for (var i = 0; i < step.length; i++) {
                    step[i].entityState = OrderManager.getDefaultEntityState();
                    // Dans le cas où un pawn à moins d'actions à jouer que les autres on lui en assigne un par défaut
                    // pour qu'i ne soit pas inactif mais si elle n'a plus de AP il ne fera rien à part rester dans sa position
                    if (step[i].order == null) {
                        step[i].order = new Order.Stand(previousStep[i].order.position, previousStep[i].order.direction);
                    }
                }

                // check actions for each entity in step
                for (var i = 0; i < step.length; i++) {
                    // foreach entities except A
                    for (var j = 0; j < step.length; j++) {
                        if (step[i].entity._id == step[j].entity._id) continue; // Pas d'interaction avec soi-même

                        let positionBBeforeOrder = previousStep[j].order.position;
                        if(previousStep[j].entityState.moved) { positionBBeforeOrder = previousStep[j].entityState.moved; }

                        step[i].data = {
                            aWasFacingB: previousStep[i].order.position.faces(positionBBeforeOrder, previousStep[i].order.direction),
                            aWasNextToB: previousStep[i].order.position.getDistanceFrom(positionBBeforeOrder) == 1,
                            fleeRate: 50,
                            entityAApCost: 1,
                            entityBHpLost: 0,
                            aIsActive: previousStep[i].entityState['ap'] > 0, // INACTIF = stand mais pas le droit d'attaquer
                            aIsAlive: previousStep[i].entityState['hp'] > 0,
                            keepDirection: (previousStep[i].order.direction == step[i].order.direction),
                            keepPosition: step[i].order.position.equals(previousStep[i].order.position),
                            equalPositions: step[i].order.position.equals(step[j].order.position),
                            differentTeams: step[i].entity.team != step[j].entity.team,
                            alteredEntityB: this.alteredPawns.indexOf(step[j].entity._id) < 0,
                            positionBBeforeOrder: positionBBeforeOrder,
                            l: l,
                            j: j
                        };

                        step[i].entityState.hp = typeof step[i].entityState.hp !== 'undefined' ? step[i].entityState.hp : previousStep[i].entityState['hp'];

                        if(!step[i].data.aIsAlive) {
                            step[i].order = new Order.Dead(previousStep[i].order.position, previousStep[i].order.direction);
                            step[i].entityState.ap = previousStep[i].entityState['ap'];
                            step[i].entityState.hp = 0;
                            previousStep[i].entityState.dies = previousStep[i].order.action !== 'dead';
                            continue;
                        }

                        if (step[i].data.equalPositions) {
                            // Si A veut aller sur la même case que B (qu'il y soit déjà statique où qu'il veuille y aller)
                            if (this.alteredPawns.indexOf(step[i].entity._id) < 0) step[i].entityState.moveHasBeenBlocked = (step[i].order.action == 'move');
                            if (this.alteredPawns.indexOf(step[j].entity._id) < 0) step[j].entityState.moveHasBeenBlocked = (step[j].order.action == 'move');
                        }

                        console.log(step[i].order);
                        step[i].order = step[i].order.process(step[i], step[j], this, steps);

                        step[j].entityState.hp = typeof step[j].entityState.hp !== 'undefined' ? step[j].entityState.hp : previousStep[j].entityState['hp'];
                        step[j].entityState.hp -= step[i].data.entityBHpLost;
                        step[i].entityState.ap = step[i].data.aIsActive ? previousStep[i].entityState['ap'] - step[i].data.entityAApCost : 0;

                        if (step[i].entityState.moveHasBeenBlocked && this.alteredPawns.indexOf(step[i].entity._id) < 0) {
                            this.blockEntity(steps, l, i, new Order.Stand(previousStep[i].order.position, previousStep[i].order.direction), step[i].entity);
                        }
                        if (step[j].entityState.moveHasBeenBlocked && this.alteredPawns.indexOf(step[j].entity._id) < 0) {
                            this.blockEntity(steps, l, j, new Order.Stand(previousStep[j].order.position, previousStep[j].order.direction), step[j].entity);
                        }
                    }
                }
            }
            return steps;
        }
    }
}
