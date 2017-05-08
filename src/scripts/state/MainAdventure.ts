declare var EasyStar;
module TacticArena.State {
    export class MainAdventure extends TacticArena.State.BasePlayable {

        init() {
            this.mapName = 'area02';
            super.init();
            this.game.stage.backgroundColor = 0x67AEE4;
            this.pointer = new UI.PointerExploration(this);
            this.pawns.push(new Entity.Pawn(this, 24, 20, 'E', 'blondy', 1, false, 1, 'Amandine'));
        }

        create() {
            this.stageManager.addDecorations();
            console.log(this.stageManager.grid);
            this.pathfinder = new EasyStar.js();
            this.pathfinder.setAcceptableTiles([-1]);
            //this.pathfinder.disableDiagonals();
            //this.pathfinder.enableDiagonals();
            //this.pathfinder.disableSync();
            this.pathfinder.setGrid(this.stageManager.grid);

            this.world.setBounds(0, 0, 2000, 2000);
            this.game.camera.follow(this.pawns[0].getSprite(), Phaser.Camera.FOLLOW_LOCKON, 0.1, 0.1);
            this.process = false;
        }
    }
}
