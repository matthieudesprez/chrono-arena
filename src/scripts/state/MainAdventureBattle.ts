declare var EasyStar;
module TacticArena.State {
    import AiManager = TacticArena.Controller.AiManager;
    import StageManager = TacticArena.Controller.StageManager;
    export class MainAdventureBattle extends TacticArena.State.BaseBattle {
        aiManager: Controller.AiManager;
        data;

        init(data) {
            console.log(data);
            this.data = data;
            super.init();
            this.game.stage.backgroundColor = 0x67AEE4;
            this.playMode = 'offline';
            this.data.players.forEach( (p, k) => {
                let isBot = true;
                if (p.player) {
                    this.playerTeam = k;
                    isBot = false;
                } else {
                    this.aiManager = new Controller.AiManager(this, k);
                }
                this.pawns.push(new Entity.Pawn(this, p.position.x, p.position.y, p.direction, p.type, this.getUniqueId(), isBot, k, p.name, p.spriteClass));
            });
        }

        create() {
            super.create();
            //this.game.camera.focusOnXY(this.pawns[0].getSprite().x + 16, this.pawns[0].getSprite().y + 16);
            this.game.camera.focusOnXY(this.data.center.x * this.tileSize + 16, this.data.center.y * this.tileSize + 16);
        }

        initMap() {
            console.log(this.data);
            this.stageManager = new StageManager(this);
            this.stageManager.initFromArray(this.data.stage, this.data.gridWidth, this.data.gridHeight);
        }

        addDecorations() {
            this.stageManager.addDecorationsFromData(this.data);
            this.stageManager.addBlackLayer(this.data);
        }

        battleOver () {
            super.battleOver();
            //this.game.state.start("mainadventure", true, false, {
            //    mainPawn: this.pawns[0].export(),
            //});
        }
    }
}