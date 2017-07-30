module TacticArena.UI {
    export class ActionMenu {
        game;
        mainGroup;

        constructor(game, pawn) {
            this.game = game;
            this.mainGroup = this.game.add.group();

            var bmd = this.game.add.bitmapData(this.game.world.width / 2, 96);
            bmd.ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
            bmd.ctx.beginPath();
            bmd.ctx.rect(0, 0, this.game.world.width / 2, 96);
            bmd.ctx.fill();
            bmd.update();

            let bgSprite = this.game.make.sprite(0, 0, bmd);
            bgSprite.anchor.set(0);

            let avatar = this.game.make.sprite(0, 0, 'avatar-' + pawn.type);
            avatar.anchor.set(0);



            this.mainGroup.add(bgSprite);
            this.mainGroup.add(avatar);
            this.mainGroup.x = 0;
            this.mainGroup.y = 608;

            let text = this.game.add.text(110, 5, pawn._name, {
                font: '20px Iceland',
                fill: '#ffffff',
                boundsAlignH: 'center',
                boundsAlignV: 'top',
            }, this.mainGroup);

            let barWidth = this.game.world.width / 2 - 120;

            this.mainGroup.add(new Bar(this.game, {
                x: 110,
                y: 40,
                width: barWidth,
                height: 20,
                text: true,
                name: 'hpbar',
                unit: 'HP',
                max: pawn._hpMax,
                textColor: '#ffffff',
                bg: { color: '#808080' },
                bar: { color: '#8b0000' },
                textStyle: '18px Iceland'
            }));

            this.mainGroup.add(new Bar(this.game, {
                x: 110,
                y: 70,
                width: barWidth,
                height: 20,
                text: true,
                name: 'apbar',
                unit: 'AP',
                max: pawn._apMax,
                textColor: '#ffffff',
                bg: { color: '#267ac9' },
                bar: { color: '#1E90FF' },
                textStyle: '18px Iceland'
            }));

            this.game.uiGroup.add(this.mainGroup);

        }
    }
}
