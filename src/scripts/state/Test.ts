declare var EasyStar;
module TacticArena.State {
    export class TestBattle extends TacticArena.State.BasePlayable {
        turnManager: TurnManager;
        orderManager: OrderManager;
        resolveManager: ResolveManager;
        logManager: LogManager;
        signalManager: SignalManager;
        uiManager: UI.UIManager;
        selecting: boolean;

        init(data?) {
            super.init(data);
            this.selecting = false; // basebattle
            this.signalManager = new SignalManager(this); // basebattle
        }

        create() {
            super.create();
            // basebattle
            this.logManager = new LogManager(this);
            this.orderManager = new OrderManager(this);
            this.resolveManager = new ResolveManager(this);
            this.turnManager = new TurnManager(this);
        }
    }
}
