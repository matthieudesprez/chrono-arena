module TacticArena.UI {
    export class ActionMenu {
        game;
        mainGroup;
        actionGroup;
        skillsGroup;
        energyGroup;
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
            this.mainGroup.y = window.innerHeight / this.game.getScaleRatio() - 100;
            //this.mainGroup.y = Math.min(512, window.innerHeight / this.game.getScaleRatio() - 100);
            //this.mainGroup.y = 512;
            this.actionGroup = this.game.add.group();
            this.actionGroup.x = 178;
            this.actionGroup.y = 63;
            this.skillsGroup = this.game.add.group();
            this.skillsGroup.x = 0;
            this.skillsGroup.y = 0;
            this.energyGroup = this.game.add.group();
            this.energyGroup.x = 160;
            this.energyGroup.y = 14;

            let frame = this.game.make.sprite(5, 0, 'frame-bottom');
            frame.anchor.set(0);

            //var filter = this.game.add.filter('Pixelate');
            //frame.filters = [filter];
            //filter.sizeX = 2;
            //filter.sizeY = 2;

            frame.inputEnabled = true;
            frame.events.onInputOver.add(this.over, this);
            frame.events.onInputOut.add(this.out, this);

            let avatar = this.game.make.sprite(37, 8, 'avatar-' + pawn.type);
            avatar.anchor.set(0);
            avatar.scale.set(0.8);

            let name = this.game.add.text(54, 5, pawn._name, {
                font: '20px Iceland',
                fill: '#ffffff',
                boundsAlignH: 'right',
                boundsAlignV: 'top',
            });
            name.anchor.set(0);
            name.setTextBounds(0, 8, 90, 20);

            let heart = self.game.make.sprite(110, 44, 'icon-heart');
            heart.scale.set(1.5);
            heart.anchor.set(0);

            let hpText = self.game.add.text(0, 0, pawn.getHp(), {
                font: '18px Iceland',
                fill: '#FFFFFF',
                align: 'center',
                boundsAlignH: 'center',
                boundsAlignV: 'center',
                strokeThickness: 3,
                stroke: '#000000',
                wordWrap: true
            });
            hpText.setTextBounds(heart.x - 1, heart.y + 2, 40, 35);

            for(var i = 0; i < pawn._apMax; i++) {
                let energy = self.game.make.sprite(i * 30, 0, 'icon-power');
                energy.anchor.set(0);
                this.energyGroup.add(energy);

                energy.inputEnabled = true;
                energy.events.onInputOver.add(this.buttonOver, this, 0);
                energy.events.onInputOut.add(this.buttonOut, this, 0);
                energy.events.onInputDown.add(this.cancel, this);
            }

            pawn.skills.forEach(function (skill, index) {
                let buttonGroup = new skillButton(self.game);
                buttonGroup.x = index * 35;
                let icon = self.game.make.sprite(0, 0, 'skill-' + skill.id);
                icon.anchor.set(0.5);
                let frame = self.game.make.sprite(0, 0, 'skill-frame2');
                frame.anchor.set(0.5);
                buttonGroup.add(icon);
                buttonGroup.add(frame);

                frame.inputEnabled = true;
                frame.events.onInputOver.add(self.buttonOver, self, 0, buttonGroup);
                frame.events.onInputOut.add(self.buttonOut, self, 0, buttonGroup);
                frame.events.onInputDown.add(self.skillSelect, self, 0, index);

                self.skillsGroup.add(buttonGroup);
                self.skills.push({ selected: false, group: buttonGroup, skill: skill});
            });

            let buttonConfirmGroup = this.game.add.group();
            buttonConfirmGroup.x = pawn.skills.length * 35;
            buttonConfirmGroup.y = 0;
            let iconConfirm = self.game.make.sprite(0, 0, 'icon-confirm');
            iconConfirm.anchor.set(0.5);
            let frameConfirm = self.game.make.sprite(0, 0, 'skill-frame2');
            frameConfirm.anchor.set(0.5);
            buttonConfirmGroup.add(iconConfirm);
            buttonConfirmGroup.add(frameConfirm);

            iconConfirm.inputEnabled = true;
            iconConfirm.events.onInputOver.add(this.buttonOver, this, 0, buttonConfirmGroup);
            iconConfirm.events.onInputOut.add(this.buttonOut, this, 0, buttonConfirmGroup);
            iconConfirm.events.onInputDown.add(this.confirm, this);

            //let buttonCancelGroup = this.game.add.group();
            //buttonCancelGroup.x = pawn.skills.length * 35;
            //buttonCancelGroup.y = -35;
            //let iconCancel = self.game.make.sprite(0, 0, 'icon-cancel');
            //iconCancel.anchor.set(0.5);
            //let frameCancel = self.game.make.sprite(0, 0, 'skill-frame2');
            //frameCancel.anchor.set(0.5);
            //buttonCancelGroup.add(iconCancel);
            //buttonCancelGroup.add(frameCancel);
            //
            //frameCancel.inputEnabled = true;
            //frameCancel.events.onInputOver.add(this.buttonOver, this, 0, buttonCancelGroup);
            //frameCancel.events.onInputOut.add(this.buttonOut, this, 0, buttonCancelGroup);
            //frameCancel.events.onInputDown.add(this.cancel, this);

            this.mainGroup.add(frame);
            this.mainGroup.add(avatar);
            this.mainGroup.add(name);
            this.mainGroup.add(heart);
            this.mainGroup.add(hpText);
            this.mainGroup.add(this.energyGroup);
            //this.mainGroup.add(this.hpBar);
            //this.mainGroup.add(this.apBar);

            this.actionGroup.add(this.skillsGroup);
            //this.actionGroup.add(buttonCancelGroup);
            this.actionGroup.add(buttonConfirmGroup);
            this.mainGroup.add(this.actionGroup);
            this.game.uiGroup.add(this.mainGroup);
        }

        over() {
            this.isOver = true;
        }

        out() {
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
            this.energyGroup.children.forEach( (child, index) => {
                if(index >= remainingAp) {
                    child.loadTexture('icon-power-empty');
                } else {
                    child.loadTexture('icon-power');
                }
            });
        }

        cancel() {
            Action.Cancel.process(this.game);
        }

        confirm() {
            Action.ConfirmOrder.process(this.game);
        }

        buttonOver(buttonSprite, pointer, buttonGroup) {
            console.log(this.buttonOver.arguments);
            this.isOver = true;
            if(buttonGroup) {
                buttonGroup.scale.setTo(buttonGroup.scale.x - 0.1, buttonGroup.scale.y - 0.1);
            }
        }

        buttonOut(buttonSprite, pointer, buttonGroup) {
            this.isOver = false;
            if(buttonGroup) {
                buttonGroup.scale.setTo(buttonGroup.scale.x + 0.1, buttonGroup.scale.y + 0.1);
            }
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
