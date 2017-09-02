module TacticArena.UI {
    export class TimelineMenu {
        game;
        mainGroup;
        isOver;
        timelineGroup;
        steps_number;
        stepsColors;

        constructor(game) {
            let self = this;
            this.isOver = false;
            this.game = game;
            this.mainGroup = this.game.add.group();
            this.timelineGroup = this.game.add.group();

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

            this.mainGroup.add(bgSprite);
            this.mainGroup.add(border);

            this.mainGroup.x = 0;
            this.mainGroup.y = Math.max(512, window.innerHeight / this.game.getScaleRatio()  - 96);

            this.game.uiGroup.add(this.mainGroup);
        }

        init (steps_number:Number):Promise<any> {
            this.steps_number = steps_number;
            return new Promise((resolve, reject) => {
                var self = this;
                this.stepsColors = [];
                for (var i = 0; i < this.steps_number; i++) {
                    let key = 'step';
                    if (i == 0) { key = 'step-first'; }
                    else if (i == this.steps_number - 1) { key = 'step-last'; }

                    let stepGroup = this.game.add.group();
                    let step = self.game.make.sprite(0, 0, key);
                    step.anchor.set(0);

                    step.inputEnabled = true;
                    step.events.onInputDown.add(this.goToStep, this, 0, i);

                    stepGroup.add(step);
                    stepGroup.x = i * 36;
                    stepGroup.y = 0;
                    this.stepsColors.push(stepGroup.add(this.game.add.group())); // pour gérer la couleur au dessus

                    this.timelineGroup.add(stepGroup);

                    if(i < this.steps_number - 1) {
                        let join = self.game.make.sprite(i * 36 + 14, 3, 'step-join');
                        join.anchor.set(0);
                        this.timelineGroup.add(join);
                    }
                }

                this.timelineGroup.scale.setTo(1.5, 1.5);
                this.timelineGroup.x = this.game.world.width / 2 - this.timelineGroup.width / 2;
                this.timelineGroup.y = this.mainGroup.height / 2 - this.timelineGroup.height / 2;
                this.mainGroup.add(this.timelineGroup);

                let buttonPrevious = self.game.make.sprite(0, this.mainGroup.height / 2 - 23, 'button-previous');
                buttonPrevious.anchor.set(0);
                let buttonNext = self.game.make.sprite(this.game.world.width - 37, this.mainGroup.height / 2 - 23, 'button-next');
                buttonNext.anchor.set(0);

                buttonPrevious.inputEnabled = true;
                buttonPrevious.events.onInputDown.add(this.previous, this);
                buttonNext.inputEnabled = true;
                buttonNext.events.onInputDown.add(this.next, this);

                this.mainGroup.add(buttonPrevious);
                this.mainGroup.add(buttonNext);

                resolve(true);
            });
        }

        update(current) {
            let self = this;
            this.stepsColors.forEach((stepColor:Phaser.Group, index) => {
                console.log(stepColor, current, index);
                stepColor.removeAll(true);
                if(index > current) { return; }

                let key = (index < current) ? 'step-old' : 'step-active';
                let color = self.game.make.sprite(3, 3, key);
                color.anchor.set(0);
                stepColor.update();
                console.log(stepColor.add(color));
            });
        }

        clean () {
            this.mainGroup.destroy();
        }

        over() {
            this.isOver = true;
        }

        out() {
            this.isOver = false;
        }

        next () {
            Action.Timeline.GoForward.process(this.game);
        }

        previous () {
            Action.Timeline.GoBackward.process(this.game);
        }

        goToStep (clickedSprite, pointer, index) {
            if (index != this.game.resolveManager.currentIndex) {
                this.game.isPaused = true;
                this.game.resolveManager.processSteps(index, false, index < this.game.resolveManager.currentIndex);
            }
        }
    }
}