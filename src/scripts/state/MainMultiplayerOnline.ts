declare var EasyStar;
module TacticArena.State {
    export class MainMultiplayerOnline extends TacticArena.State.BaseBattle {

        init(data, chatUI, serverManager) {
            super.init();
            var self = this;
            this.playMode = 'online';
            this.chatUI = chatUI;
            this.serverManager = serverManager;
            this.serverManager.game = this;
            this.players = data.content.players;
            let startPositions = [[new Position(8, 8, 'E'), new Position(7, 7, 'E')], [new Position(11, 8, 'W'), new Position(12, 7, 'W')]];
            this.players.forEach( (p, k) => {
                if (p.token == self.serverManager.token) {
                    //this.playerTeam = k;
                }
                if (p.faction == 'human') {
                    this.pawns.push(new Champion.BaseChampion(this, startPositions[k][0], 'ruairi', this.getUniqueId(), k, this.generator.generate()));
                    this.pawns.push(new Champion.BaseChampion(this, startPositions[k][1], 'blondy', this.getUniqueId(), k, this.generator.generate()));
                } else {
                    this.pawns.push(new Champion.BaseChampion(this, startPositions[k][0], 'evil', this.getUniqueId(), k, this.generator.generate()));
                    this.pawns.push(new Champion.BaseChampion(this, startPositions[k][1], 'skeleton', this.getUniqueId(), k, this.generator.generate()));
                }
            });
        }

        create() {
            super.create();
        }
    }
}
