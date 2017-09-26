module TacticArena.UI {
    export class Transition {
        menu;
        text;
        overlay;

        constructor(menu) {
            this.menu = menu;
        }

        hide() {
            return new Promise((resolve, reject) => {
                let self = this;
                this.menu.game.add.tween(this.overlay).to({alpha: 0}, 1000, Phaser.Easing.Linear.None, true);
                let t = this.menu.game.add.tween(this.text).to({alpha: 0}, 1000, Phaser.Easing.Linear.None, true);
                t.onComplete.add(function () {
                    self.clean();
                    resolve(true);
                }, self);
            });
        }

        showOverlay() {
            this.overlay = this.menu.game.make.graphics(0, 0);
            this.overlay.beginFill(0x000000, 0.7);
            this.overlay.x = 0;
            this.overlay.y = 0;
            this.overlay.drawRect(0, 0, this.menu.game.world.width, this.menu.game.world.height);
            this.menu.game.uiGroup.add(this.overlay);
        }

        clean() {
            this.text.destroy();
            this.overlay.destroy();
        }

        show(message) {
            return new Promise((resolve, reject) => {
                resolve(true);
                //let self = this;
                //this.showOverlay();
                //this.text = this.menu.game.add.text(0, this.menu.game.world.centerY - 100, message, {
                //    font: '50px Iceland',
                //    fill: '#AB9352',
                //    stroke: '#FFFFFF',
                //    strokeThickness: 3
                //}, this.menu.game.uiGroup);
                //this.text.x = this.menu.game.world.centerX - this.text.width / 2;
                //this.text.alpha = 0;
                //
                //let t = this.menu.game.add.tween(this.text).to( { alpha: 1 }, 1000, Phaser.Easing.Linear.None, true);
                //t.onComplete.add(function () {
                //    resolve(self.hide());
                //}, self);
            });
        }

        filterAnimation() {
            return new Promise((resolve, reject) => {
                //var filter = this.menu.game.add.filter('BlurX');
                //var filter = this.menu.game.add.filter('BlurY');
                //var filter = this.menu.game.add.filter('Pixelate');
                //filter.blur = 0;
                //this.menu.game.worldGroup.filters = [filter];

                //let t = this.menu.game.add.tween(filter).to( { sizeX: 100, sizeY: 100, blur: 100 }, 2000, "Quad.easeInOut", true, 0, 0, true);
                //t.onComplete.add(function () {
                    resolve(true);
                //}, self);
            });
        }
    }
}
