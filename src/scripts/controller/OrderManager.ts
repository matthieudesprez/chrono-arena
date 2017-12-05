module TacticArena {
    /*
     Handle the add/remove orders mechanics
     And the orders to steps transformation
     */
    export class OrderManager {
        orders: ChampionOrders[];
        state;
        alteredPawns: number[];
        movedChampions: Champion.BaseChampion[];

        constructor(state) {
            this.state = state;
            this.orders = [];
            this.alteredPawns = [];
            this.movedChampions = [];
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
                    new StepUnitData((champion.isAlive() ? champion._apMax : 0), champion.getHp()),
                    champion.isAlive() ? new Order.Stand(champion.getPosition()) : new Order.Dead(champion.getPosition())
                ));
            });
            return step;
        }

        /*
         Replace all champion steps for the given order, from startI to the end
         */
        blockChampion(steps: Step[], startI: number, j: number, order: Order.BaseOrder): void {
            let stepUnit = steps[startI].stepUnits[j];
            stepUnit.data.positionBlocked = stepUnit.order.position;
            stepUnit.data.moveHasBeenBlocked = (stepUnit.order instanceof Order.Move);
            stepUnit.checked = false;

            for (var i = startI; i < steps.length; i++) {
                if (steps[i].stepUnits[j].order) {
                    if (i > startI && steps[i].stepUnits[j].order instanceof Order.Move) {
                        steps[i].stepUnits[j].order = order;
                    }
                    steps[i].stepUnits[j].order.position = order.position;
                }
            }
            this.alteredPawns.push(stepUnit.pawn._id);
        }

        /*
         Replace all champion steps for a Stand order at given position, from startI to the end
         */
        pacifyChampion(steps, startI, j, position): void {
            for (var i = startI; i < steps.length; i++) {
                steps[i].stepUnits[j].order = new Order.Stand(position);
            }
            this.alteredPawns.push(steps[0].stepUnits[j].pawn._id);
        }

        /*
         Return true if the given position is not already used by any of the stepUnits (to avoid having 2 champions on the same tile)
         */
        tileIsFree(stepUnits: StepUnit[], position: Position): boolean {
            return !stepUnits.some((stepUnit: StepUnit) => {
                return (
                    this.state.stageManager.isObstacle(position) &&
                    ((typeof stepUnit.data.moved === 'undefined' && stepUnit.order.position.equals(position)) || // the champion is not moved and its default order position equals the given position
                    (stepUnit.data.moved && stepUnit.data.moved.equals(position))) // the champion is moved and its movedPosition equals the given position
                );
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
                        new StepUnitData(),
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
                this.alteredPawns = []; // Reset alteredPawns
                this.movedChampions = []; // Reset movedChampions
                let previousStepUnit = steps[l - 1].stepUnits;

                step.stepUnits.forEach((stepUnit: StepUnit, i: number) => {
                    stepUnit.checked = false; // Activate the interaction process with other stepUnits
                    stepUnit.data = new StepUnitData(previousStepUnit[i].data.ap, previousStepUnit[i].data.hp); // Init stepUnit.data with previous stepUnit data
                    if (stepUnit.order == null) { // In case a pawn has less actions to play than the others
                        stepUnit.order = new Order.Stand(previousStepUnit[i].order.position); // He gots a default one
                    }
                });

                let count = 0;
                while (step.stepUnits.some(stepUnit => {return !stepUnit.checked;})) { // While there are stepUnits to check
                    step.stepUnits.forEach((stepUnitA: StepUnit, i: number) => { // Check actions for each stepUnit (champion) in current step
                        stepUnitA.checked = true; // Interaction is checked
                    });

                    step.stepUnits.forEach((stepUnitA: StepUnit, i: number) => { // Check actions for each stepUnit (champion) in current step
                        step.stepUnits.forEach((stepUnitB: StepUnit, j: number) => { // Foreach other stepUnit
                            if (stepUnitA.pawn._id === stepUnitB.pawn._id) return; // Except A, no interaction with oneself
                            this.processStep(steps, l, i, j, stepUnitA, stepUnitB);
                        });
                    });

                    /* We have to iterate again over all step.stepUnits to handle Champions who could have been moved */
                    step.stepUnits.forEach((stepUnitA: StepUnit) => { // Check actions for each stepUnit (champion) in current step
                        step.stepUnits.forEach((stepUnitB: StepUnit) => { // Foreach other stepUnit
                            if (!stepUnitB.checked && stepUnitA.hasInteractedWith.indexOf(stepUnitB.pawn._id) >= 0) {
                                stepUnitA.checked = false; // Must be checked again (in the next while iteration)
                                stepUnitA.hasInteractedWith.splice(stepUnitA.hasInteractedWith.indexOf(stepUnitB.pawn._id), 1);
                            }
                        });
                    });

                    count++;
                    if (count > step.stepUnits.length) {
                        console.log('maximum reached');
                        break;
                    }
                }
            });
            return steps;
        }

        processStep(steps, l, i, j, stepUnitA, stepUnitB) {
            let previousStepUnit = steps[l - 1].stepUnits;

            stepUnitA.data.hp = typeof stepUnitA.data.hp !== 'undefined' ? stepUnitA.data.hp : previousStepUnit[i].data.hp;

            if (previousStepUnit[i].data.hp <= 0) { // If the Champion was dead in the previous step
                stepUnitA.order = new Order.Dead(previousStepUnit[i].order.position); // TODO check interaction ?
            }

            stepUnitA.order = stepUnitA.order.process(this, steps, l, i, j); // Apply the Skill / Order on the step

            stepUnitA.data.ap = Math.max(0, previousStepUnit[i].data.ap + steps[l].getAp(stepUnitA.pawn));
            stepUnitB.data.hp = previousStepUnit[j].data.hp + steps[l].getHp(stepUnitB.pawn);
        }
    }
}
