declare var EasyStar;
module TacticArena.State {
    import AiManager = TacticArena.Controller.AiManager;
    import StageManager = TacticArena.Controller.StageManager;
    export class MainAdventureBattle extends TacticArena.State.BaseBattle {
        aiManager: Controller.AiManager;
        importedStage;

        init(data) {
            this.importedStage = data.stage;
            super.init();
            this.game.stage.backgroundColor = 0x67AEE4;
            console.log(data);
            this.playMode = 'offline';
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

                this.pawns.push(
                    new Entity.Pawn(
                        this,
                        p.position.x,
                        p.position.y,
                        p.direction,
                        p.type,
                        this.getUniqueId(),
                        isBot,
                        k,
                        p.name,
                        p.spriteClass
                    )
                );
                console.log('jajoute mes pawns');
            });
        }

        create() {
            super.create();
        }

        initMap() {
            this.stageManager = new StageManager(this);
            this.stageManager.initFromArray(this.importedStage);
        }

        addDecorations() {
            this.stageManager.addDecorationsFromData(this.importedStage);
        }
    }
}
