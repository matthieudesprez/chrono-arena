declare var EasyStar;
module TacticArena.State {
    import AiManager = TacticArena.AiManager;
    export class MainSoloOffline extends TacticArena.State.BaseBattle {

        init(data) {
            super.init(data);
            this.playMode = 'offline';
            this.players = data.players;
            if (this.players.some((player: Player.BasePlayer) => { return player.isBot; })) {
                this.aiManager = new AiManager(this);
            }
            this.players.forEach((player: Player.BasePlayer, i: number) => {
                player._id = i;
                player.battleParty.forEach((character, characterIndex) => {
                    let champion = new character(this, this.map.startPositions[player._id][characterIndex], this.getUniqueId(), player._id);
                    this.pawns.push(champion);
                    this.spritesManager.add(champion);
                });
            });
        }
    }
}
