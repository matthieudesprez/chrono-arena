declare var EasyStar;
module TacticArena.State {
    import AiManager = TacticArena.AiManager;
    export class MainSoloOffline extends TacticArena.State.BaseBattle {
        aiManager: AiManager;

        init(data, chatUI) {
            super.init();
            console.log(data);
            this.playMode = 'offline';
            this.chatUI = chatUI;
            this.players = data.players;
            let startPositions = [[{x: 6, y: 10, d: 'E'}, {x: 5, y: 9, d: 'E'}], [{x: 9, y: 10, d: 'W'}, {x: 10, y: 9, d: 'W'}]];
            this.players.forEach( (p, k) => {
                let isBot = true;
                if (p.player) {
                    this.playerTeam = k;
                    isBot = false;
                } else {
                    this.aiManager = new AiManager(this, k);
                }
                if (p.faction == 'human') {
                    let pawn = new Entity.Character.Ruairi(this, startPositions[k][0].x, startPositions[k][0].y, startPositions[k][0].d, this.getUniqueId(), isBot, k);
                    this.pawns.push(pawn);
                    //this.pawns.push(new Entity.Pawn(this, startPositions[k][1].x, startPositions[k][1].y, startPositions[k][1].d, 'amanda', this.getUniqueId(), isBot, k, this.generator.generate(), Entity.Sprite));
                } else {
                    this.pawns.push(new Entity.Pawn(this, startPositions[k][0].x, startPositions[k][0].y, startPositions[k][0].d, 'skeleton', this.getUniqueId(), isBot, k, this.generator.generate(), Entity.Sprite));
                    //this.pawns.push(new Entity.Pawn(this, startPositions[k][1].x, startPositions[k][1].y, startPositions[k][1].d, 'skeleton', this.getUniqueId(), isBot, k, this.generator.generate(), Entity.Sprite));
                }
                console.log('jajoute mes pawns');
            });
        }

        create() {
            super.create();
        }
    }
}
