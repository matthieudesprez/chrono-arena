module TacticArena {
    export class PlayerBot extends Player {

        constructor(name) {
            super(name);
            this.faction = 'bot';
            this.isMainPlayer = false;
            this.isBot = true;
            this.battleParty = [Entity.Character.Skeleton, Entity.Character.Evil];
        }
    }
}
