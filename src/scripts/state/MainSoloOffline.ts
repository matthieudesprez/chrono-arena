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
            let startPositions = [[{x: 4, y: 9, d: 'E'}, {x: 3, y: 8, d: 'E'}], [{x: 7, y: 9, d: 'W'}, {x: 8, y: 8, d: 'W'}]];
            this.players.forEach( (p, k) => {
                let isBot = true;
                if (p.player) {
                    this.playerTeam = k;
                    isBot = false;
                } else {
                    this.aiManager = new AiManager(this, k);
                }
                if (p.faction == 'human') {
                    this.pawns.push(new Entity.Character.Ruairi(this, startPositions[k][0].x, startPositions[k][0].y, startPositions[k][0].d, this.getUniqueId(), isBot, k));
                    //this.pawns.push(new Entity.Pawn(this, startPositions[k][1].x, startPositions[k][1].y, startPositions[k][1].d, 'amanda', this.getUniqueId(), isBot, k, this.generator.generate(), Entity.Sprite));
                } else {
                    this.pawns.push(new Entity.Character.Skeleton(this, startPositions[k][0].x, startPositions[k][0].y, startPositions[k][0].d, this.getUniqueId(), isBot, k));
                    //this.pawns.push(new Entity.Pawn(this, startPositions[k][1].x, startPositions[k][1].y, startPositions[k][1].d, 'skeleton', this.getUniqueId(), isBot, k, this.generator.generate(), Entity.Sprite));
                }
            });
        }

        create() {
            super.create();
        }

        //render() {
        //    this.game.debug.spriteBounds(this.uiManager.topMenu.pawns[0].apText, 'rgba(255,0,0,0.5)');
        //}
    }
}
