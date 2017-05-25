declare var EasyStar;
module TacticArena.State {
    export class MainAdventure extends TacticArena.State.BasePlayable {

        init(data) {
            console.log(data);
            this.mapName = 'area02';
            super.init();
            this.game.stage.backgroundColor = 0x67AEE4;
            this.pointer = new UI.PointerExploration(this);
            let position = (data && data.position) ? data.position : {x: 25, y: 15};
            this.pawns.push(new Entity.Pawn(this, position.x, position.y, 'N', 'redhead', 1, false, 1, 'Amandine', Entity.Sprite)); //
            //this.pawns.push(new Entity.Pawn(this, 25, 6, 'E', 'rabbit', 1, false, 1, 'Amandine', Entity.MobSpriteSimpleBis)); //
            this.pawns.push(new Entity.Pawn(this, 25, 11, 'E', 'bee', 1, false, 1, 'Amandine', Entity.MobSpriteSimple)); //
            this.stageManager.markPawns();
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
        }

        update () {
            super.update();
            this.game.camera.focusOnXY(this.pawns[0].getSprite().x + 16, this.pawns[0].getSprite().y + 16);
        }

        //initMap() {
        //    this.stageManager = new Controller.StageManager(this);
        //    this.stageManager.initFromArray([]);
        //}
    }
}
