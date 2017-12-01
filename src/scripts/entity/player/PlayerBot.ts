module TacticArena.Player {
    export class Bot extends BasePlayer {

        constructor(name) {
            super(name);
            this.faction = 'bot';
            this.isLocalPlayer = true;
            this.isBot = true;
            this.battleParty = [Champion.Skeleton, Champion.Evil];
        }
    }
}
