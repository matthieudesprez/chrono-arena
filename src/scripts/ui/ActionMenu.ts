module TacticArena.UI {
    export class ActionMenu {
        game;
        mainGroup;
        skillsGroup;
        isOver;
        savedDirection;
        apBar;
        cancelButton;
        confirmButton;
        skills;

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

            let frame = this.game.make.sprite(0, 0, 'frame');
            frame.anchor.set(0);

            let verticalBorder = this.game.make.sprite(100, 6, 'vertical-border');
            verticalBorder.anchor.set(0);
            verticalBorder.height = 128;

            let avatar = this.game.make.sprite(0, 0, 'avatar-' + pawn.type);
            avatar.anchor.set(0);

            this.mainGroup.add(bgSprite);
            this.mainGroup.add(frame);
            this.mainGroup.add(verticalBorder);
            this.mainGroup.add(avatar);
            this.mainGroup.x = 0;
            this.mainGroup.y = Math.max(512, window.innerHeight / this.game.getScaleRatio() - 96);

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
                bg: {color: '#808080'},
                bar: {color: '#8b0000'},
                textStyle: '16px Iceland'
            }));

            this.apBar = new Bar(this.game, {
                x: 118 + barWidth,
                y: 10,
                width: barWidth,
                height: 15,
                text: true,
                name: 'apbar',
                unit: 'AP',
                max: pawn._apMax,
                value: pawn.getAp(),
                textColor: '#ffffff',
                bg: {color: '#267ac9'},
                bar: {color: '#1E90FF'},
                textStyle: '16px Iceland'
            });
            this.mainGroup.add(this.apBar);

            this.skillsGroup = this.game.add.group();
            let offsetX = 47;
            this.skills = [];
            pawn.skills.forEach(function (skill, index) {
                let actionMenuSkill = {
                    selected: false,
                    sprite: null,
                    skill: skill
                };

                let buttonX = index > 0 ? index * 82 : 0;
                let buttonY = 0;
                if (index > 0) {
                    buttonX += index * 10;
                }
                if (index >= 2) {
                    buttonY = 30;
                    buttonX -= 2 * 10 + 2 * 82;
                }
                let button = self.game.make.sprite(offsetX + buttonX + 41, buttonY + 13, 'button-bg');
                button.anchor.set(0.5);
                self.skillsGroup.add(button);

                button.inputEnabled = true;
                button.events.onInputOver.add(self.buttonOver, self);
                button.events.onInputOut.add(self.buttonOut, self);
                button.events.onInputDown.add(self.skillSelect, self, 0, actionMenuSkill);

                let text = self.game.add.text(buttonX, buttonY, skill.name, {
                    font: '10px Press Start 2P',
                    fill: '#000000',
                    boundsAlignH: 'center',
                    boundsAlignV: 'top',
                }, self.skillsGroup);
                text.setTextBounds(offsetX, 8, 83, 20);

                actionMenuSkill.sprite = button;
                self.skills.push(actionMenuSkill);
            });

            this.skillsGroup.x = 110;
            this.skillsGroup.y = 30;

            this.confirmButton = this.game.make.sprite(this.game.world.width - this.skillsGroup.position.x - 6, 28, 'button-confirm');
            this.confirmButton.anchor.set(1, 0.5);
            this.skillsGroup.add(this.confirmButton);

            this.confirmButton.inputEnabled = true;
            this.confirmButton.events.onInputOver.add(this.buttonOver, this);
            this.confirmButton.events.onInputOut.add(this.buttonOut, this);
            this.confirmButton.events.onInputDown.add(this.confirm, this);

            this.cancelButton = this.game.make.sprite(-3, 28, 'button-cancel');
            this.cancelButton.anchor.set(0, 0.5);
            this.skillsGroup.add(this.cancelButton);

            this.cancelButton.inputEnabled = true;
            this.cancelButton.events.onInputOver.add(this.buttonOver, this);
            this.cancelButton.events.onInputOut.add(this.buttonOut, this);
            this.cancelButton.events.onInputDown.add(this.cancel, this);

            this.mainGroup.add(this.skillsGroup);
            this.game.uiGroup.add(this.mainGroup);

            this.selectDefaultSkill();
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

        clean() {
            this.mainGroup.destroy();
        }

        showApCost(pawn, apCost) {
            let remainingAp = pawn.getAp() - apCost;
            let currentPercent = (remainingAp / pawn._apMax) * 100;

            this.apBar.updateValue(remainingAp);
            this.apBar.setPercent(currentPercent);
        }

        cancel() {
            Action.Cancel.process(this.game);
        }

        confirm() {
            Action.ConfirmOrder.process(this.game);
        }

        buttonOver(buttonSprite) {
            this.isOver = true;
            buttonSprite.scale.setTo(1.1, 1.1);
        }

        buttonOut(buttonSprite) {
            this.isOver = false;
            buttonSprite.scale.setTo(1, 1);
        }

        skillDeselectAll() {
            this.skills.forEach(function (actionMenuSkill) {
                if(actionMenuSkill.selected) {
                    actionMenuSkill.sprite.loadTexture('button-bg', 0, false);
                    actionMenuSkill.skill.onDeselect();
                    actionMenuSkill.selected = false;
                }
            });
        }

        skillSelect(sprite, pointer, actionMenuSkill) {
            this.skillDeselectAll();
            actionMenuSkill.sprite.loadTexture('button-selected-bg', 0, false);
            actionMenuSkill.skill.onSelect();
            actionMenuSkill.selected = true;
        }

        getSelectedSkill() {
            return this.skills.filter(skill => {return skill.selected;})[0].skill;
        }

        selectDefaultSkill() {
            this.skillSelect(null, null, this.skills[1]);
        }
    }
}
