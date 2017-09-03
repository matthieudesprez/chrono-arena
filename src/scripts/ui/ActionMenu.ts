module TacticArena.UI {
    export class ActionMenu {
        game;
        mainGroup;
        actionGroup;
        skillsGroup;
        isOver;
        savedDirection;
        hpBar;
        apBar;
        cancelButton;
        confirmButton;
        skills;

        constructor(game, pawn) {
            let self = this;
            this.isOver = false;
            this.game = game;
            this.skills = [];
            this.mainGroup = this.game.add.group();
            this.mainGroup.x = 0;
            this.mainGroup.y = Math.max(512, window.innerHeight / this.game.getScaleRatio() - 96);
            this.actionGroup = this.game.add.group();
            this.actionGroup.x = 110;
            this.actionGroup.y = 30;
            this.skillsGroup = this.game.add.group();
            this.skillsGroup.x = 60;
            this.skillsGroup.y = 27;

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

            let name = this.game.add.text(0, 5, pawn._name, {
                font: '20px Iceland',
                fill: '#ffffff',
                boundsAlignH: 'right',
                boundsAlignV: 'top',
            });
            name.setTextBounds(0, 8, 90, 20);

            let barWidth = this.game.world.width / 2 - 64;
            this.hpBar = new Bar(this.game, {
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
            });
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

            pawn.skills.forEach(function (skill, index) {
                let buttonGroup = new skillButton(self.game);
                buttonGroup.x = index * 48;
                let icon = self.game.make.sprite(0, 0, 'skill-' + skill.id);
                icon.anchor.set(0.5);
                let frame = self.game.make.sprite(0, 0, 'skill-frame');
                frame.anchor.set(0.5);
                buttonGroup.add(icon);
                buttonGroup.add(frame);

                frame.inputEnabled = true;
                frame.events.onInputOver.add(self.buttonOver, self);
                frame.events.onInputOut.add(self.buttonOut, self);
                frame.events.onInputDown.add(self.skillSelect, self, 0, index);

                self.skillsGroup.add(buttonGroup);
                self.skills.push({ selected: false, group: buttonGroup, skill: skill});
            });

            this.confirmButton = this.game.make.sprite(this.game.world.width - this.actionGroup.position.x - 6, 28, 'button-confirm');
            this.confirmButton.anchor.set(1, 0.5);
            this.confirmButton.inputEnabled = true;
            this.confirmButton.events.onInputOver.add(this.buttonOver, this);
            this.confirmButton.events.onInputOut.add(this.buttonOut, this);
            this.confirmButton.events.onInputDown.add(this.confirm, this);

            this.cancelButton = this.game.make.sprite(-3, 28, 'button-cancel');
            this.cancelButton.anchor.set(0, 0.5);
            this.cancelButton.inputEnabled = true;
            this.cancelButton.events.onInputOver.add(this.buttonOver, this);
            this.cancelButton.events.onInputOut.add(this.buttonOut, this);
            this.cancelButton.events.onInputDown.add(this.cancel, this);

            this.mainGroup.add(bgSprite);
            this.mainGroup.add(frame);
            this.mainGroup.add(verticalBorder);
            this.mainGroup.add(avatar);
            this.mainGroup.add(name);
            this.mainGroup.add(this.hpBar);
            this.mainGroup.add(this.apBar);
            this.actionGroup.add(this.skillsGroup);
            this.actionGroup.add(this.cancelButton);
            this.actionGroup.add(this.confirmButton);
            this.mainGroup.add(this.actionGroup);
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

        skillDeselectAll(oneIsSelected=false) {
            this.skills.forEach(function (actionMenuSkill) {
                actionMenuSkill.group.alpha = 1;
                if (oneIsSelected) { actionMenuSkill.group.alpha = 0.7; }
                if(actionMenuSkill.selected) {
                    actionMenuSkill.skill.onDeselect();
                    actionMenuSkill.selected = false;
                }
            });
        }

        skillSelect(sprite, pointer, index){
            this.skillDeselectAll(true);
            this.skills[index].skill.onSelect();
            this.skills[index].selected = true;
            this.skills[index].group.alpha = 1;
        }

        getSelectedSkill() {
            let result = null;
            try {
                result = this.skills.filter(skill => { return skill.selected;})[0].skill;
            } catch (TypeError) {
                //console.warn('no selected skill');
            }
            return result;
        }

        selectDefaultSkill() {
            this.skillSelect(null, null, 1);
        }
    }
}
