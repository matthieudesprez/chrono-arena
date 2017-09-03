module TacticArena.UI {
    export class skillButton extends Phaser.Group {
        selected:Boolean;

        constructor(game:Phaser.Game) {
            super(game);
        }

        //update():void {
        //    super.update();
        //    if(this.selected) {
        //        this.game.add.tween(this).to({
        //            tint : 0.65 * 0xffffff,
        //            alpha : 0.5
        //        }, 100, Phaser.Easing.Exponential.Out, true, 0, 0, true);
        //    }
        //}

    }
}
