declare var EasyStar;
module TacticArena.State {
    export class MainAdventure extends TacticArena.State.BasePlayable {
        dialogUI;

        init(data) {
            this.mapName = 'area02';
            super.init();
            this.game.stage.backgroundColor = 0x67AEE4;
            this.pointer = new UI.PointerExploration(this);

            let position = (data && data.mainPawn.position) ? data.mainPawn.position : {x: 25, y: 15};
            let direction = (data && data.mainPawn.getDirection()) ? data.mainPawn.getDirection() : 'N';
            let name = (data && data.mainPawn.name) ? data.mainPawn.name : 'Red';
            let type = (data && data.mainPawn.type) ? data.mainPawn.type : 'ruairi';
            let spriteClass = (data && data.mainPawn.spriteClass) ? data.mainPawn.spriteClass : Sprite.BaseSprite;
            this.pawns.push(new Champion.BaseChampion(this, new Position(position.x, position.y, direction), type, 1, 1, name, spriteClass)); //

            //this.pawns.push(new BaseChampion(this, 25, 6, 'E', 'rabbit', 1, false, 1, 'Amandine', Sprite.MobSpriteSimpleBis)); //
            //let enemyPosition = [{x:7,y:15},{x:12,y:23},{x:14,y:11},{x:24,y:11}][Math.floor(Math.random() * 4)];
            let enemyPosition = {x:24,y:11};
            //this.pawns.push(new BaseChampion(this, enemyPosition.x, enemyPosition.y, 'E', 'bee', 1, false, 1, 'Amandine', Sprite.MobSpriteSimple)); //
            this.stageManager.markPawns();

            this.dialogUI = new UI.Dialog(this);
        }

        create() {
            super.create();
            let self = this;

            //this.world.setBounds(0, 0, 2000, 2000);
            //this.game.camera.follow(this.pawns[0].getSprite(), Phaser.Camera.STYLE_TOPDOWN_TIGHT, 0.1, 0.1);
            this.process = false;

            //$(window).on('keyup', function (e) {
            //    if(e.keyCode == 37) {
            //        self.game.camera.x += 10;
            //        //self.pawns[0].getSprite().attack();
            //    } else if(e.keyCode == 38) {
            //        self.game.camera.x -= 10;
            //        //self.pawns[0].getSprite().cast();
            //    } else if(e.keyCode == 39) {
            //        //self.pawns[0].getSprite().die();
            //    }
            //});

            //let message = this.game.add.text(Math.abs(this.game.world.position.x) + this.game.camera.width/2, Math.abs(this.game.world.position.y) + this.game.camera.height/2, 'ok', { font: '20px Arial', fill: "#ffffff" });
            //message.fixedToCamera = true;
            this.dialogUI.showModal("modal1");

        }

        update () {
            super.update();
            let position = this.spritesManager.getReal(this.pawns[0]).getPosition();
            this.game.camera.focusOnXY(position.x + 16, position.y + 16);
        }

        //initMap() {
        //    this.stageManager = new StageManager(this);
        //    this.stageManager.initFromArray([]);
        //}
    }
}
