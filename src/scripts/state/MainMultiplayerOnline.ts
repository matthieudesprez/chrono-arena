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
            let startPositions = [[{x: 8, y: 8, d: 'E'}, {x: 7, y: 7, d: 'E'}], [{x: 11, y: 8, d: 'W'}, {x: 12, y: 7, d: 'W'}]];
            this.players.forEach( (p, k) => {
                if (p.token == self.serverManager.token) {
                    //this.playerTeam = k;
                }
                if (p.faction == 'human') {
                    this.pawns.push(new Entity.Pawn(this, startPositions[k][0].x, startPositions[k][0].y, startPositions[k][0].d, 'ruairi', this.getUniqueId(), k, this.generator.generate()));
                    this.pawns.push(new Entity.Pawn(this, startPositions[k][1].x, startPositions[k][1].y, startPositions[k][1].d, 'blondy', this.getUniqueId(), k, this.generator.generate()));
                } else {
                    this.pawns.push(new Entity.Pawn(this, startPositions[k][0].x, startPositions[k][0].y, startPositions[k][0].d, 'evil', this.getUniqueId(), k, this.generator.generate()));
                    this.pawns.push(new Entity.Pawn(this, startPositions[k][1].x, startPositions[k][1].y, startPositions[k][1].d, 'skeleton', this.getUniqueId(), k, this.generator.generate()));
                }
            });
        }

        create() {
            super.create();
        }
    }
}
