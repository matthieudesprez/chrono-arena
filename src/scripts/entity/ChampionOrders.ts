module TacticArena {
    /*
    Represents the orders list of a champion (for one turn)
     */
    export class ChampionOrders {
        champion: Champion.BaseChampion;
        list: Order.BaseOrder[];

        constructor(champion: Champion.BaseChampion, list: Order.BaseOrder[] = []) {
            this.champion = champion;
            this.list = list;
        }
    }
}
