module TacticArena.UI {
    export class ActionMenu {
        game;
        mainGroup;
        skillsGroup;
        isOver;
        savedDirection;

        constructor(game, pawn) {
            let self = this;
            this.isOver = false;
            this.game = game;
            this.mainGroup = this.game.add.group();

            var bmd = this.game.add.bitmapData(this.game.world.width, 96);
            bmd.ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
            bmd.ctx.beginPath();
            bmd.ctx.rect(0, 0, this.game.world.width, 96);
            bmd.ctx.fill();
            bmd.update();

            let bgSprite = this.game.make.sprite(0, 0, bmd);
            bgSprite.anchor.set(0);

            bgSprite.inputEnabled = true;
            bgSprite.events.onInputOver.add(this.over, this);
            bgSprite.events.onInputOut.add(this.out, this);

            let border = this.game.make.sprite(0, 0, 'border');
            border.anchor.set(0);

            let verticalBorder = this.game.make.sprite(100, 4, 'vertical-border');
            verticalBorder.anchor.set(0);

            let avatar = this.game.make.sprite(0, 0, 'avatar-' + pawn.type);
            avatar.anchor.set(0);

            this.mainGroup.add(bgSprite);
            this.mainGroup.add(border);
            this.mainGroup.add(verticalBorder);
            this.mainGroup.add(avatar);
            this.mainGroup.x = 0;
            this.mainGroup.y = Math.max(512, window.innerHeight / this.game.getScaleRatio()  - 96);

            let text = this.game.add.text(0, 5, pawn._name, {
                font: '20px Iceland',
                fill: '#ffffff',
                boundsAlignH: 'right',
                boundsAlignV: 'top',
            }, this.mainGroup);
            text.setTextBounds(0, 8, 90, 20);

            let barWidth = this.game.world.width / 2 - 64;

            this.mainGroup.add(new Bar(this.game, {
                x: 110,
                y: 10,
                width: barWidth,
                height: 15,
                text: true,
                name: 'hpbar',
                unit: 'HP',
                max: pawn._hpMax,
                value: pawn.getHp(),
                textColor: '#ffffff',
                bg: { color: '#808080' },
                bar: { color: '#8b0000' },
                textStyle: '16px Iceland'
            }));

            this.mainGroup.add(new Bar(this.game, {
                x: 120 + barWidth,
                y: 10,
                width: barWidth,
                height: 15,
                text: true,
                name: 'apbar',
                unit: 'AP',
                max: pawn._apMax,
                value: pawn.getAp(),
                textColor: '#ffffff',
                bg: { color: '#267ac9' },
                bar: { color: '#1E90FF' },
                textStyle: '16px Iceland'
            }));

            this.skillsGroup = this.game.add.group();
            let offsetX = 47;
            pawn.skills.forEach(function(skill, index) {
                console.log(skill);
                let buttonX = index > 0 ? index * 83 : 0;
                let buttonY = 0;
                if(index > 0) {
                    buttonX += index * 10;
                }
                if(index >= 2) {
                    buttonY = 30;
                    buttonX -= 2 * 10 + 2 * 83;
                }
                let button = self.game.make.sprite(offsetX + buttonX, buttonY, 'button-bg');
                button.anchor.set(0);
                button.scale.setTo(1.5, 1.5);
                self.skillsGroup.add(button);

                let text = self.game.add.text(buttonX, buttonY, skill.name, {
                    font: '10px Press Start 2P',
                    fill: '#000000',
                    boundsAlignH: 'center',
                    boundsAlignV: 'top',
                }, self.skillsGroup);
                text.setTextBounds(offsetX, 8, 83, 20);
            });

            this.skillsGroup.x = 110;
            this.skillsGroup.y = 30;

            let buttonConfirm = self.game.make.sprite(self.game.world.width - 37 - self.skillsGroup.position.x, 5, 'button-confirm');
            buttonConfirm.anchor.set(0);
            self.skillsGroup.add(buttonConfirm);

            let buttonCancel = self.game.make.sprite(-5, 5, 'button-cancel');
            buttonCancel.anchor.set(0);
            self.skillsGroup.add(buttonCancel);

            this.mainGroup.add(this.skillsGroup);
            this.game.uiGroup.add(this.mainGroup);
        }

        over() {
            console.log('over');
            this.isOver = true;
        }

        out() {
            console.log('out');
            this.isOver = false;
        }

        initDirection(direction) {
            this.savedDirection = direction;
            this.selectDirection(direction);
        }

        selectDirection(direction) {
            //deselect direction icons
            //select right direction icon
        }

        clean () {
            this.mainGroup.destroy();
        }
    }
}
