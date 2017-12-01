declare var EasyStar;
module TacticArena.State {
    import AiManager = TacticArena.AiManager;
    export class MainSoloOffline extends TacticArena.State.BaseBattle {

        init(data) {
            super.init(data);
            this.playMode = 'offline';
            this.players = data.players;
            this.players.forEach( (player: Player.BasePlayer, playerId: number) => {
                player._id = playerId;
                if (player.isBot) { this.aiManager = new AiManager(this, player._id); }
                player.battleParty.forEach((character, characterIndex) => {
                    let pawn = new character(
                        this,
                        this.map.startPositions[player._id][characterIndex].x,
                        this.map.startPositions[player._id][characterIndex].y,
                        this.map.startPositions[player._id][characterIndex].d,
                        this.getUniqueId(),
                        player._id);
                    this.pawns.push(pawn);
                    this.spritesManager.add(pawn);
                });
            });
        }

        //render() {
        //    this.game.debug.spriteBounds(this.uiManager.topMenu.pawns[0].apText, 'rgba(255,0,0,0.5)');
        //}
    }
}
