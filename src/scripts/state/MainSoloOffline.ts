declare var EasyStar;
module TacticArena.State {
    import AiManager = TacticArena.AiManager;
    export class MainSoloOffline extends TacticArena.State.BaseBattle {
        aiManager: AiManager;

        init(data) {
            super.init(data);
            this.playMode = 'offline';
            this.players = data.players;
            this.players.forEach( (player, teamIndex) => {
                if (player.isMainPlayer) {
                    this.playerTeam = teamIndex;
                } else { //TODO ok seulement si pas plus de 2 players
                    this.aiManager = new AiManager(this, teamIndex);
                }
                player.battleParty.forEach((character, characterIndex) => {
                    let pawn = new character(
                        this,
                        this.map.startPositions[teamIndex][characterIndex].x,
                        this.map.startPositions[teamIndex][characterIndex].y,
                        this.map.startPositions[teamIndex][characterIndex].d,
                        this.getUniqueId(),
                        player.isBot,
                        teamIndex);
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
