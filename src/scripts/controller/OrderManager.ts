module TacticArena {
    /*
     Handle the add/remove orders mechanics
     And the orders to steps transformation
     */
    export class OrderManager {
        orders: ChampionOrders[];
        state;
        alteredPawns: number[];

        constructor(state) {
            this.state = state;
            this.orders = [];
            this.alteredPawns = [];
        }

        /*
         Remove the champion's registered orders from this.orders (in case of cancelling)
         */
        removeOrders(champion: Champion.BaseChampion): void {
            this.orders = this.orders.filter((championOrders: ChampionOrders) => {
                return championOrders.champion._id !== champion._id;
            });
            this.state.signalManager.onOrderChange.dispatch(champion);
        }

        /*
         Return true if the champion already has registered orders
         */
        hasOrder(champion: Champion.BaseChampion): boolean {
            return this.orders.some((championOrders: ChampionOrders) => {
                return championOrders.champion._id === champion._id;
            });
        }

        /*
         Add an order to the champion's orders
         */
        add(champion: Champion.BaseChampion, order: Order.BaseOrder, triggerDispatch: boolean = true) {
            if (!this.hasOrder(champion)) { this.orders.push(new ChampionOrders(champion)); }
            this.getOrders(champion).push(order);
            if (triggerDispatch) { this.state.signalManager.onOrderChange.dispatch(champion); }
        }

        /*
        Return the champion's orders list
         */
        getOrders(champion): Order.BaseOrder[] {
            if (!this.hasOrder(champion)) { return []; }
            return this.orders.find((championOrders: ChampionOrders) => {
                return championOrders.champion._id === champion._id;
            }).list;
        }

        /*
        Return the biggest champion orders list length
         */
        getMaxOrderListLength(): number {
            return this.orders.reduce((a: ChampionOrders, b: ChampionOrders) => {
                return a.list.length > b.list.length ? a : b;
            }).list.length;
        }

        /*
         In case of a pawn having less actions than the others, fill this.orders with Stand orders
         */
        formatOrders(): void {
            let self = this;
            this.state.pawns.forEach((champion: Champion.BaseChampion) => {
                if (!self.hasOrder(champion)) {
                    // TODO must be filled with something else, not including the position or direction because it can change if moved by a tornado for example
                    self.add(champion, new Order.Stand(champion.getPosition(), champion.getDirection()), false);
                }
            });
        }

        /*
        Return the initial step corresponding of the step 0 in the turn resolution
         */
        getInitialStep(): Step {
            let step = new Step();
            this.orders.forEach((championOrders: ChampionOrders) => {
                let champion = championOrders.champion;
                step.stepUnits.push(new StepUnit(
                    champion,
                    new StepUnitData((champion.isAlive() ? champion._apMax : 0), champion.getHp()),
                    champion.isAlive() ? new Order.Stand(champion.getPosition(), champion.getDirection()) : new Order.Dead(champion.getPosition(), champion.getDirection())
                ));
            });
            return step;
        }

        //TODO virer
        static resolutionEsquive(fleeRate) {
            return (Math.floor(Math.random() * 100) > fleeRate);
        }

        blockEntity(steps, startI, j, order, champion) {
            steps[startI].stepUnits[j].data.positionBlocked = steps[startI].stepUnits[j].order.position;
            for (var i = startI; i < steps.length; i++) {
                if (steps[i].stepUnits[j].order) {
                    if (i > startI && steps[i].stepUnits[j].order.action == 'move') {
                        steps[i].stepUnits[j].order = order;
                    }
                    steps[i].stepUnits[j].order.position = order.position;
                    steps[i].stepUnits[j].data.altered = true;
                }
            }
            this.alteredPawns.push(champion._id);
            return steps;
        }

        pacifyEntity(steps, startI, j, order, champion, state) {
            for (var i = startI; i < steps.length; i++) {
                let position = state.moved !== null ? new Position(state.moved.x, state.moved.y) : steps[i].stepUnits[j].order.position;
                steps[i].stepUnits[j].order = new Order.Stand(
                    position,
                    order.direction
                );
                steps[i].stepUnits[j].data.altered = true;
            }
            this.alteredPawns.push(champion._id);
            return steps;
        }

        getSteps(): Step[] {
            this.alteredPawns = [];
            this.formatOrders();
            let steps = new Array(this.getMaxOrderListLength());
            for (var j = 0; j < steps.length; j++) {
                steps[j] = new Step();
                for (var i = 0; i < this.orders.length; i++) {
                    var pawn = this.orders[i].champion;
                    steps[j].stepUnits.push(new StepUnit(
                        pawn,
                        new StepUnitData(),
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
            this.state.pawns.forEach(p => {
                if (p._id == id) {
                    result = p;
                }
            });
            return result;
        }

        tileIsFree(stepUnits: StepUnit[], position: Position) {
            for (var i = 0; i < stepUnits.length; i++) {
                if (
                    (typeof stepUnits[i].data.moved === 'undefined' && position.equals(stepUnits[i].order.position)) ||
                    (stepUnits[i].data.moved && stepUnits[i].data.moved.equals(position))) {
                    return false;
                }
            }
            return true;
        }

        processOrders(steps: Step[]): Step[] {
            for (var l = 1; l < steps.length; l++) {
                var stepUnits = steps[l].stepUnits;
                let previousStepUnit = steps[l - 1].stepUnits;
                for (var i = 0; i < stepUnits.length; i++) {
                    stepUnits[i].data = new StepUnitData(previousStepUnit[i].data.ap, previousStepUnit[i].data.hp);
                    // In case a pawn has less actions to play than the others he got a default one but if he has 0 AP he won't do anything
                    if (stepUnits[i].order == null) {
                        stepUnits[i].order = new Order.Stand(previousStepUnit[i].order.position, previousStepUnit[i].order.direction);
                    }
                }

                // check actions for each entity in step
                for (var i = 0; i < stepUnits.length; i++) {
                    // foreach entities except A
                    for (var j = 0; j < stepUnits.length; j++) {
                        if (stepUnits[i].pawn._id == stepUnits[j].pawn._id) continue; // Pas d'interaction avec soi-même

                        let positionBBeforeOrder = previousStepUnit[j].data.moved ? previousStepUnit[j].data.moved : previousStepUnit[j].order.position;

                        stepUnits[i].data.aWasFacingB = previousStepUnit[i].order.position.faces(positionBBeforeOrder, previousStepUnit[i].order.direction);
                        stepUnits[i].data.aWasNextToB = previousStepUnit[i].order.position.getDistanceFrom(positionBBeforeOrder) == 1;
                        stepUnits[i].data.championAApCost = 1;
                        stepUnits[i].data.championBHpLost = 0;
                        stepUnits[i].data.aIsActive = previousStepUnit[i].data.ap > 0; // INACTIF = stand mais pas le droit d'attaquer
                        stepUnits[i].data.aIsAlive = previousStepUnit[i].data.hp > 0;
                        stepUnits[i].data.keepDirection = (previousStepUnit[i].order.direction == stepUnits[i].order.direction);
                        stepUnits[i].data.keepPosition = stepUnits[i].order.position.equals(previousStepUnit[i].order.position);
                        stepUnits[i].data.equalPositions = stepUnits[i].order.position.equals(stepUnits[j].order.position);
                        stepUnits[i].data.differentTeams = stepUnits[i].pawn.team != stepUnits[j].pawn.team;
                        stepUnits[i].data.alteredChampionB = this.alteredPawns.indexOf(stepUnits[j].pawn._id) < 0;
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

                        stepUnits[j].data.hp -= stepUnits[i].data.championBHpLost;
                        stepUnits[i].data.ap = stepUnits[i].data.aIsActive ? previousStepUnit[i].data.ap - stepUnits[i].data.championAApCost : 0;

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
