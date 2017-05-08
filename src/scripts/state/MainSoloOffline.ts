declare var EasyStar;
module TacticArena.State {
    import AiManager = TacticArena.Controller.AiManager;
    export class MainSoloOffline extends TacticArena.State.BaseBattle {
        aiManager: Controller.AiManager;

        init(data, chatUI) {
            super.init();
            console.log(data);
            this.playMode = 'offline';
            this.chatUI = chatUI;
            this.players = data.players;
            let startPositions = [[{x: 8, y: 8, d: 'E'}, {x: 7, y: 7, d: 'E'}], [{x: 11, y: 8, d: 'W'}, {x: 12, y: 7, d: 'W'}]];
            this.players.forEach( (p, k) => {
                let isBot = true;
                if (p.player) {
                    this.playerTeam = k;
                    isBot = false;
                } else {
                    this.aiManager = new Controller.AiManager(this, k);
                }
                if (p.faction == 'human') {
                    this.pawns.push(new Entity.Pawn(this, startPositions[k][0].x, startPositions[k][0].y, startPositions[k][0].d, 'redhead', this.getUniqueId(), isBot, k, this.generator.generate()));
                    this.pawns.push(new Entity.Pawn(this, startPositions[k][1].x, startPositions[k][1].y, startPositions[k][1].d, 'blondy', this.getUniqueId(), isBot, k, this.generator.generate()));
                } else {
                    this.pawns.push(new Entity.Pawn(this, startPositions[k][0].x, startPositions[k][0].y, startPositions[k][0].d, 'evil', this.getUniqueId(), isBot, k, this.generator.generate()));
                    this.pawns.push(new Entity.Pawn(this, startPositions[k][1].x, startPositions[k][1].y, startPositions[k][1].d, 'skeleton', this.getUniqueId(), isBot, k, this.generator.generate()));
                }
                console.log('jajoute mes pawns');
            });
        }

        create() {
            super.create();
        }
    }
}
