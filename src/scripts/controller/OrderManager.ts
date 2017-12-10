module TacticArena {
    /*
     Handle the add/remove orders mechanics
     And the orders to steps transformation
     */
    export class OrderManager {
        orders: ChampionOrders[];
        state;

        constructor(state) {
            this.state = state;
            this.orders = [];
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
            if (!this.hasOrder(champion)) {
                this.orders.push(new ChampionOrders(champion));
            }
            this.getOrders(champion).push(order);
            if (triggerDispatch) {
                this.state.signalManager.onOrderChange.dispatch(champion);
            }
        }

        /*
         Return the champion's orders list
         */
        getOrders(champion): Order.BaseOrder[] {
            if (!this.hasOrder(champion)) {
                return [];
            }
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
         In case of a Champion having less actions than the others, fill this.orders with Stand orders
         */
        formatOrders(): void {
            let self = this;
            this.state.pawns.forEach((champion: Champion.BaseChampion) => {
                if (!self.hasOrder(champion)) {
                    self.add(champion, new Order.Stand(champion.getPosition()), false);
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
                    (champion.isAlive() ? champion._apMax : 0),
                    champion.getHp(),
                    champion.isAlive() ? new Order.Stand(champion.getPosition()) : new Order.Dead(champion.getPosition())
                ));
            });
            return step;
        }

        /*
         Replace all champion steps for the given order, from startI to the end
         */
        blockChampion(steps: Step[], startI: number, j: number, order: Order.Stand): void {
            let stepUnit = steps[startI].stepUnits[j];
            stepUnit.blockedPosition = stepUnit.order.position.clone();
            stepUnit.checked = false;

            for (var i = startI; i < steps.length; i++) {
                if (steps[i].stepUnits[j].order) {
                    if (i > startI && steps[i].stepUnits[j].order instanceof Order.Move) {
                        steps[i].stepUnits[j].order = new Order.Stand(order.position.clone());
                    }
                    steps[i].stepUnits[j].order.position = order.position.clone();
                }
            }
        }

        /*
         Replace all champion steps for a Stand order at given position, from startI to the end
         */
        pacifyChampion(steps, startI, j, position): void {
            for (var i = startI; i < steps.length; i++) {
                steps[i].stepUnits[j].order = new Order.Stand(position);
            }
        }

        /*
        Translate all champion steps orders with the given (x, y), from startI to the end
         */
        translateOrders(steps: Step[], startI: number, j: number, translate: Position): void {
            for (var i = startI; i < steps.length; i++) {
                steps[i].stepUnits[j].order.position = steps[i].stepUnits[j].order.position.translate(translate.x, translate.y);
            }
        }

        /*
         Return true if the given position is not already used by any of the stepUnits (to avoid having 2 champions on the same tile)
         */
        tileIsFree(stepUnits: StepUnit[], position: Position): boolean {
            return !this.state.stageManager.isObstacle(position) && !stepUnits.some((stepUnit: StepUnit) => {
                return stepUnit.getPosition().equals(position);
            });
        }

        getSteps(): Step[] {
            this.formatOrders();
            let steps = new Array(this.getMaxOrderListLength());
            for (var j = 0; j < steps.length; j++) {
                steps[j] = new Step();
                for (var i = 0; i < this.orders.length; i++) {
                    var pawn = this.orders[i].champion;
                    steps[j].stepUnits.push(new StepUnit(
                        pawn,
                        null,
                        null,
                        this.orders[i].list[j] ? this.orders[i].list[j] : null
                    ));
                }
            }
            steps.unshift(this.getInitialStep());
            this.orders = [];
            return this.processOrders(steps);
        }

        processOrders(steps: Step[]): Step[] {
            steps.forEach((step: Step, l: number) => {
                if (l === 0) return; // The first step represents the initial state of each Champion, they don't interact yet
                let previousStepUnits = steps[l - 1].stepUnits;

                step.stepUnits.forEach((stepUnitA: StepUnit, i: number) => {
                    stepUnitA.ap = previousStepUnits[i].ap;
                    stepUnitA.hp = previousStepUnits[i].hp; // Init stepUnit with previous stepUnit data
                    if (stepUnitA.order === null) { // In case a pawn has less actions to play than the others
                        stepUnitA.order = new Order.Stand(previousStepUnits[i].order.position); // He gots a default one
                    }
                    if (previousStepUnits[i].hp <= 0 && !(stepUnitA.order instanceof Order.Dead)) { // If the Champion was dead in the previous step
                        stepUnitA.order = new Order.Dead(previousStepUnits[i].getPosition());
                    }
                });

                let count = 0;
                while (step.stepUnits.some(stepUnit => {return !stepUnit.checked;})) { // While there are stepUnits to check

                    step.stepUnits.forEach((stepUnitA: StepUnit) => { // Check actions for each stepUnit (champion) in current step
                        stepUnitA.checked = true; // Interaction is checked
                    });

                    [1, 0].forEach((priority: number) => { // Move Order are treated first (priority = 1), then the others
                        step.stepUnits.forEach((stepUnitA: StepUnit, i: number) => { // Check actions for each stepUnit (champion) in current step
                            if (stepUnitA.order.getPriority() === priority) {
                                step.stepUnits.forEach((stepUnitB: StepUnit, j: number) => { // Foreach other stepUnit
                                    if (stepUnitA.pawn._id === stepUnitB.pawn._id) return; // Except A => no interaction with oneself
                                    stepUnitA.order.process(this, steps, l, i, j); // Apply the Skill / Order on the step
                                });
                            }
                        });
                    });

                    count++;
                    if (count > step.stepUnits.length) {
                        console.log('maximum reached');
                        break;
                    }
                }

                step.stepUnits.forEach((stepUnitA: StepUnit, i: number) => { // Update AP & HP
                    stepUnitA.ap = Math.max(0, previousStepUnits[i].ap + steps[l].getAp(stepUnitA.pawn));
                    stepUnitA.hp = previousStepUnits[i].hp > 0 ? previousStepUnits[i].hp + steps[l].getHp(stepUnitA.pawn) : 0;
                });
            });
            return steps;
        }
    }
}
