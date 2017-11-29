module TacticArena {
    export class PlayerBot extends Player {

        constructor(name) {
            super(name);
            this.faction = 'bot';
            this.isLocalPlayer = true;
            this.isBot = true;
            this.battleParty = [Entity.Character.Skeleton, Entity.Character.Evil];
        }
    }
}
