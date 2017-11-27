module TacticArena.UI {
    export class ActionMenu {
        game;
        mainGroup;
        actionGroup;
        skillsGroup;
        mpGroup;
        mpText;
        apGroup;
        apText;
        hpGroup;
        hpText;
        isOver;
        savedDirection;
        buttonCancelGroup;
        buttonConfirmGroup;
        skills;
        confirmEnabled;
        pawn;
        playable;

        constructor(game, pawn) {
            let self = this;
            this.isOver = false;
            this.game = game;
            this.pawn = pawn;
            this.playable = this.pawn._id == this.game.turnManager.getActivePawn()._id;
            this.skills = [];
            this.confirmEnabled = true;
            this.mainGroup = this.game.add.group();
            this.mainGroup.x = 0;
            this.mainGroup.y = this.game.height - 110;
            this.actionGroup = this.game.add.group();
            this.actionGroup.x = 120;
            this.actionGroup.y = 60;
            this.skillsGroup = this.game.add.group();
            this.skillsGroup.x = 0;
            this.skillsGroup.y = 0;
            this.hpGroup = this.game.add.group();
            this.hpGroup.x = 107;
            this.hpGroup.y = 14;
            this.apGroup = this.game.add.group();
            this.apGroup.x = 192;
            this.apGroup.y = 14;
            this.mpGroup = this.game.add.group();
            this.mpGroup.x = 273;
            this.mpGroup.y = 14;

            let frame = this.game.make.sprite(this.game.world.centerX - 2, 0, 'frame-bottom');
            frame.anchor.set(0.5, 0);

            frame.inputEnabled = true;
            frame.events.onInputOver.add(this.over, this);
            frame.events.onInputOut.add(this.out, this);

            let avatar = this.game.make.sprite(37, 84, 'avatar-' + pawn.type);
            avatar.anchor.set(0, 1);

            let name = this.game.add.text(40, 5, pawn._name, {
                font: '20px Iceland',
                fill: '#ffffff',
                boundsAlignH: 'left',
                boundsAlignV: 'top',
            });
            name.anchor.set(0);
            name.setTextBounds(0, 8, 96, 20);

            let hpIcon = self.game.make.sprite(0, 0, 'icon-heart');
            hpIcon.anchor.set(0);
            this.hpGroup.add(hpIcon);
            this.hpText = this.game.add.text(32, 0, pawn.getHp() + ' / ' + pawn._hpMax, {
                font: '20px Iceland',
                fill: '#ffffff',
                boundsAlignH: 'left',
                boundsAlignV: 'center',
            }, this.hpGroup);
            this.hpText.anchor.set(0);
            this.hpText.setTextBounds(0, 0, 70, 25);

            let apIcon = self.game.make.sprite(0, -2, 'icon-power4');
            apIcon.anchor.set(0);
            this.apGroup.add(apIcon);
            this.apText = this.game.add.text(28, 0, pawn.getAp() + ' / ' + pawn._apMax, {
                font: '20px Iceland',
                fill: '#ffffff',
                boundsAlignH: 'left',
                boundsAlignV: 'center',
            }, this.apGroup);
            this.apText.anchor.set(0);
            this.apText.setTextBounds(0, 0, 70, 25);

            let mpIcon = self.game.make.sprite(0, -2, 'icon-mp2');
            mpIcon.anchor.set(0);
            this.mpGroup.add(mpIcon);
            this.mpText = this.game.add.text(28, 0, pawn.getMp() + ' / ' + pawn._mpMax, {
                font: '20px Iceland',
                fill: '#ffffff',
                boundsAlignH: 'left',
                boundsAlignV: 'center',
            }, this.mpGroup);
            this.mpText.anchor.set(0);
            this.mpText.setTextBounds(0, 0, 70, 25);

            let skillSpacing = 40;
            pawn.skills.forEach(function (skill, index) {
                let buttonGroup = new skillButton(self.game);
                buttonGroup.x = skillSpacing + index * skillSpacing;
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
                self.skills.push({selected: false, group: buttonGroup, skill: skill});
            });

            this.buttonConfirmGroup = this.game.add.group();
            this.buttonCancelGroup = this.game.add.group();
            if(this.playable) {
                this.buttonConfirmGroup.x = skillSpacing + pawn.skills.length * skillSpacing;
                this.buttonConfirmGroup.y = 0;
                let iconConfirm = self.game.make.sprite(0, 0, 'icon-confirm');
                iconConfirm.anchor.set(0.5);
                let frameConfirm = self.game.make.sprite(0, 0, 'skill-frame2');
                frameConfirm.anchor.set(0.5);
                this.buttonConfirmGroup.add(iconConfirm);
                this.buttonConfirmGroup.add(frameConfirm);
                iconConfirm.inputEnabled = true;
                iconConfirm.events.onInputOver.add(this.buttonOver, this, 0, this.buttonConfirmGroup);
                iconConfirm.events.onInputOut.add(this.buttonOut, this, 0, this.buttonConfirmGroup);
                iconConfirm.events.onInputDown.add(this.confirm, this);

                this.buttonCancelGroup.x = 0;
                this.buttonCancelGroup.y = 0;
                let iconCancel = self.game.make.sprite(0, 0, 'icon-cancel');
                iconCancel.anchor.set(0.5);
                let frameCancel = self.game.make.sprite(0, 0, 'skill-frame2');
                frameCancel.anchor.set(0.5);
                this.buttonCancelGroup.add(iconCancel);
                this.buttonCancelGroup.add(frameCancel);
                frameCancel.inputEnabled = true;
                frameCancel.events.onInputOver.add(this.buttonOver, this, 0, this.buttonCancelGroup);
                frameCancel.events.onInputOut.add(this.buttonOut, this, 0, this.buttonCancelGroup);
                frameCancel.events.onInputDown.add(this.cancel, this);
                this.disableCancel();
            }

            this.mainGroup.add(frame);
            this.mainGroup.add(avatar);
            this.mainGroup.add(name);
            this.mainGroup.add(this.hpGroup);
            this.mainGroup.add(this.apGroup);
            this.mainGroup.add(this.mpGroup);

            this.actionGroup.add(this.skillsGroup);
            this.actionGroup.add(this.buttonCancelGroup);
            this.actionGroup.add(this.buttonConfirmGroup);
            this.mainGroup.add(this.actionGroup);
            this.game.uiGroup.add(this.mainGroup);

            this.initDirection(pawn.getDirection());
            this.update();
        }

        over() {
            this.isOver = true;
        }

        out() {
            this.isOver = false;
        }

        initDirection(direction) {
            this.savedDirection = direction;
        }

        clean() {
            this.mainGroup.destroy();
        }

        showCost(pawn, type, cost) {
            if (type === 'hp') {
                this.hpText.text = (pawn.getHp() - cost) + ' / ' + pawn._hpMax;
            } else if (type === 'ap') {
                this.apText.text = (pawn.getAp() - cost) + ' / ' + pawn._apMax;
            } else if (type === 'mp') {
                this.mpText.text = (pawn.getMp() - cost) + ' / ' + pawn._mpMax;
            }
        }

        cancel() {
            if(this.playable) {
                Action.Cancel.process(this.game);
            }
        }

        confirm() {
            if (this.playable && this.confirmEnabled) {
                Action.ConfirmOrder.process(this.game);
            }
        }

        buttonOver(buttonSprite, pointer, buttonGroup) {
            this.isOver = true;
        }

        buttonOut(buttonSprite, pointer, buttonGroup) {
            this.isOver = false;
        }

        enableConfirm() {
            this.confirmEnabled = true;
            this.buttonConfirmGroup.alpha = 1;
        }

        disableConfirm() {
            this.confirmEnabled = false;
            this.buttonConfirmGroup.alpha = 0.5;
        }

        enableCancel() {
            this.buttonCancelGroup.alpha = 1;
        }

        disableCancel() {
            this.buttonCancelGroup.alpha = 0.5;
        }

        skillDeselectAll(oneIsSelected = false) {
            this.skills.forEach(function (actionMenuSkill) {
                actionMenuSkill.group.alpha = 1;
                if (oneIsSelected) {
                    actionMenuSkill.group.alpha = 0.5;
                }
                if (actionMenuSkill.selected) {
                    actionMenuSkill.skill.onDeselect();
                    actionMenuSkill.selected = false;
                }
            });
        }

        skillSelect(sprite, pointer, index) {
            if (this.playable && this.skills[index].skill.minCost <= this.pawn.getAp()) {
                this.skillDeselectAll(true);
                this.skills[index].skill.onSelect();
                this.skills[index].selected = true;
                this.skills[index].group.alpha = 1;
                this.enableCancel();
                this.disableConfirm();
            }
        }

        getSelectedSkill() {
            let result = null;
            try {
                result = this.skills.filter(skill => {
                    return skill.selected;
                })[0].skill;
            } catch (TypeError) {
                //console.warn('no selected skill');
            }
            return result;
        }

        update() {
            let self = this;
            this.skills.forEach(function (actionMenuSkill) {
                actionMenuSkill.group.alpha = 1;
                if (actionMenuSkill.skill.minCost > self.pawn.getAp()) {
                    actionMenuSkill.group.alpha = 0.5;
                }
            });
        }
    }
}
