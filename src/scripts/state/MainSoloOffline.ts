declare var EasyStar;
module TacticArena.State {
    import AiManager = TacticArena.AiManager;
    export class MainSoloOffline extends TacticArena.State.BaseBattle {
        aiManager: AiManager;

        init(data, chatUI) {
            super.init(data);
            this.playMode = 'offline';
            this.chatUI = chatUI;
            this.players = data.players;
            this.players.forEach( (player, teamIndex) => {
                if (player.isMainPlayer) {
                    this.playerTeam = teamIndex;
                } else { //TODO ok seulement si pas plus de 2 players
                    this.aiManager = new AiManager(this, teamIndex);
                }
                player.battleParty.forEach((character, characterIndex) => {
                    this.pawns.push(new character(this, this.map.startPositions[teamIndex][characterIndex].x, this.map.startPositions[teamIndex][characterIndex].y, this.map.startPositions[teamIndex][characterIndex].d, this.getUniqueId(), player.isBot, teamIndex))
                });
            });
        }

        create() {
            super.create();

            this.pawns[1].setHp(4);
        }

        //render() {
        //    this.game.debug.spriteBounds(this.uiManager.topMenu.pawns[0].apText, 'rgba(255,0,0,0.5)');
        //}
    }
}
