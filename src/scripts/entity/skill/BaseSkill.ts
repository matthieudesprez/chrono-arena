module TacticArena.Skill {
    export abstract class BaseSkill {
        state;
        pawn;
        id;
        name;
        description;
        minCost;
        range;

        constructor(state, pawn) {
            this.state = state;
            this.pawn = pawn;
            this.id = '';
            this.name = '';
            this.description = '';
            this.minCost = 0;
            this.range = 0;
        }

        canOrder(): boolean {
            return this.pawn.getAp() >= this.minCost;
        }

        abstract updateUI(position): void
        abstract cleanUI(): void
        abstract order(target): void
        abstract onDeselect(): void
        abstract onSelect(): void
    }
}
